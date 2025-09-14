'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import { Navbar } from '@/components/Navbar'
import { validatePromoCode, calculateDiscount } from '@/lib/mockData'
import { PromoCode } from '@/types'
import { toast } from 'sonner'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart()
  const { user } = useAuth()
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [customSpecs, setCustomSpecs] = useState<{ [productId: string]: string }>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const subtotal = getTotal()
  const discount = appliedPromo ? calculateDiscount(subtotal, appliedPromo) : 0
  const total = subtotal - discount

  const handleApplyPromo = () => {
    const promo = validatePromoCode(promoCode)
    if (promo) {
      setAppliedPromo(promo)
      toast.success(`Promo code applied! You saved ${promo.type === 'percentage' ? promo.value + '%' : '$' + promo.value}`)
    } else {
      toast.error('Invalid or expired promo code')
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoCode('')
    toast.success('Promo code removed')
  }

  const handleCustomSpecChange = (productId: string, specs: string) => {
    setCustomSpecs(prev => ({
      ...prev,
      [productId]: specs
    }))
  }

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (user.balance < total) {
      toast.error('Insufficient balance. Please top up your account.')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, this would make API calls to process the order
      toast.success('Order placed successfully! Check your dashboard for details.')
      clearCart()
      router.push('/dashboard/orders')
    } catch {
      toast.error('Failed to process order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <Navbar />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🛒</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
              <p className="text-gray-300 text-lg max-w-md mx-auto">
                Looks like you haven&apos;t added any products to your cart yet.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  Browse Products
                </Button>
              </Link>
              <Link href="/custom">
                <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Custom Development
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-gray-300">Review your selected items and proceed to checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <Card key={`${item.product.id}-${index}`} className="bg-gray-900/50 border-purple-800/50">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-32 h-32 overflow-hidden rounded-lg">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.product.name}</h3>
                          <p className="text-gray-400 text-sm">{item.product.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={item.product.type === 'license' ? 'default' : 'secondary'} 
                                   className={item.product.type === 'license' ? 'bg-green-900 text-green-400' : 'bg-blue-900 text-blue-400'}>
                              {item.product.type === 'license' ? 'License' : 'Custom'}
                            </Badge>
                            <Badge variant="outline" className="border-purple-700/50 text-purple-300">
                              {item.product.category}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <Label className="text-gray-300">Quantity:</Label>
                          {item.product.type === 'license' ? (
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                className="h-8 w-8 p-0 border-purple-600 text-purple-400"
                              >
                                -
                              </Button>
                              <span className="text-white w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="h-8 w-8 p-0 border-purple-600 text-purple-400"
                              >
                                +
                              </Button>
                            </div>
                          ) : (
                            <span className="text-white">1 (Custom Project)</span>
                          )}
                        </div>
                        <div className="text-xl font-bold text-purple-400">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      {/* Custom Specifications for Custom Products */}
                      {item.product.type === 'custom' && (
                        <div className="space-y-2">
                          <Label className="text-gray-300">Project Specifications:</Label>
                          <Textarea
                            placeholder="Describe your requirements in detail..."
                            value={customSpecs[item.product.id] || item.customSpecs || ''}
                            onChange={(e) => handleCustomSpecChange(item.product.id, e.target.value)}
                            className="bg-gray-800/50 border-purple-700/50 text-white placeholder-gray-400"
                            rows={3}
                          />
                          <p className="text-xs text-gray-400">
                            Provide detailed specifications for your custom software project.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={clearCart}
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                Clear Cart
              </Button>
              <Link href="/shop">
                <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-gray-900/50 border-purple-800/50 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Promo Code */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Promo Code</Label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-md border border-green-800/30">
                      <div>
                        <p className="text-green-400 font-medium">{appliedPromo.code}</p>
                        <p className="text-xs text-green-300">
                          {appliedPromo.type === 'percentage' ? `${appliedPromo.value}% off` : `$${appliedPromo.value} off`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePromo}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="bg-gray-800/50 border-purple-700/50 text-white placeholder-gray-400"
                      />
                      <Button
                        onClick={handleApplyPromo}
                        variant="outline"
                        className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                        disabled={!promoCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                <Separator className="bg-purple-800/50" />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="bg-purple-800/50" />
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* User Balance */}
                {user && (
                  <div className="p-3 bg-purple-900/20 rounded-md border border-purple-800/30">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Account Balance</span>
                      <span className="text-purple-400 font-semibold">${user.balance.toFixed(2)}</span>
                    </div>
                    {user.balance < total && (
                      <p className="text-red-400 text-sm mt-2">
                        Insufficient balance. You need ${(total - user.balance).toFixed(2)} more.
                      </p>
                    )}
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || (user ? user.balance < total : false)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : user ? 'Place Order' : 'Login to Checkout'}
                </Button>

                {!user && (
                  <p className="text-center text-sm text-gray-400">
                    <Link href="/login" className="text-purple-400 hover:text-purple-300">
                      Sign in
                    </Link>{' '}
                    to complete your purchase
                  </p>
                )}

                {user && user.balance < total && (
                  <Link href="/dashboard/balance">
                    <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                      Top Up Balance
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}