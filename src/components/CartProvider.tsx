'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product, CartItem, CartContextType } from '@/types'
import { toast } from 'sonner'

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Load cart from localStorage on mount
    const storedCart = localStorage.getItem('privateinstance_cart')
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch {
        localStorage.removeItem('privateinstance_cart')
      }
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever items change
    localStorage.setItem('privateinstance_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, quantity = 1, customSpecs?: string): void => {
    setItems(currentItems => {
      // For custom software, always add as new item (even if same product)
      if (product.type === 'custom') {
        const newItem: CartItem = { 
          product, 
          quantity, 
          customSpecs 
        }
        toast.success(`${product.name} added to cart`)
        return [...currentItems, newItem]
      }

      // For license products, update quantity if already exists
      const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id)
      
      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex].quantity += quantity
        toast.success(`Updated ${product.name} quantity in cart`)
        return updatedItems
      } else {
        const newItem: CartItem = { product, quantity }
        toast.success(`${product.name} added to cart`)
        return [...currentItems, newItem]
      }
    })
  }

  const removeItem = (productId: string): void => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.product.id === productId)
      if (itemToRemove) {
        toast.success(`${itemToRemove.product.name} removed from cart`)
      }
      return currentItems.filter(item => item.product.id !== productId)
    })
  }

  const updateQuantity = (productId: string, quantity: number): void => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = (): void => {
    setItems([])
    toast.success('Cart cleared')
  }

  const getTotal = (): number => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getItemCount = (): number => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}