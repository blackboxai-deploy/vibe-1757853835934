'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, LoginForm, RegisterForm, AuthContextType } from '@/types'
import { mockUsers } from '@/lib/mockData'
import { toast } from 'sonner'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('privateinstance_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('privateinstance_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginForm): Promise<void> => {
    setIsLoading(true)
    try {
      // Mock authentication - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const foundUser = mockUsers.find(u => u.email === credentials.email)
      if (foundUser) {
        setUser(foundUser)
        localStorage.setItem('privateinstance_user', JSON.stringify(foundUser))
        toast.success(`Welcome back, ${foundUser.username}!`)
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterForm): Promise<void> => {
    setIsLoading(true)
    try {
      // Mock registration - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      const existingUser = mockUsers.find(u => u.email === data.email || u.username === data.username)
      if (existingUser) {
        throw new Error('User already exists')
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        username: data.username,
        balance: 0,
        role: 'user',
        createdAt: new Date().toISOString()
      }

      setUser(newUser)
      localStorage.setItem('privateinstance_user', JSON.stringify(newUser))
      toast.success(`Account created successfully! Welcome, ${newUser.username}!`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = (): void => {
    setUser(null)
    localStorage.removeItem('privateinstance_user')
    toast.success('Logged out successfully')
  }

  const updateBalance = (amount: number): void => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount }
      setUser(updatedUser)
      localStorage.setItem('privateinstance_user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateBalance
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}