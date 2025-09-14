'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { mockTransactions } from '@/lib/mockData'
import { Transaction } from '@/types'
import { toast } from 'sonner'

export default function BalancePage() {
  const { user, isLoading, updateBalance } = useAuth()
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      // Filter user transactions
      const userTransactions = mockTransactions.filter(t => t.userId === user.id)
      setTransactions(userTransactions)
    }
  }, [user, isLoading, router])

  const predefinedAmounts = [10, 25, 50, 100, 250, 500]

  const handleTopup = async () => {
    if (!user) return

    const topupAmount = parseFloat(amount)
    if (!topupAmount || topupAmount < 5) {
      toast.error('Minimum topup amount is $5.00')
      return
    }

    if (topupAmount > 10000) {
      toast.error('Maximum topup amount is $10,000.00')
      return
    }

    setIsProcessing(true)

    try {
      // Simulate Oxapay payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Simulate payment success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1

      if (isSuccess) {
        // Update user balance
        updateBalance(topupAmount)

        // Add transaction record
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          userId: user.id,
          type: 'topup',
          amount: topupAmount,
          description: `Balance topup via ${currency}`,
          paymentMethod: currency,
          status: 'completed',
          createdAt: new Date().toISOString()
        }

        setTransactions(prev => [newTransaction, ...prev])
        setAmount('')
        
        toast.success(`Successfully added $${topupAmount.toFixed(2)} to your account!`)
      } else {
        toast.error('Payment failed. Please try again or contact support.')
      }
    } catch (error) {
      toast.error('Payment processing error. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTransactionDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Account Balance</h1>
              <p className="text-gray-300">Top up your account with cryptocurrency payments</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Balance & Topup Form */}
          <div className="space-y-6">
            {/* Current Balance */}
            <Card className="bg-gray-900/50 border-purple-800/50">
              <CardHeader>
                <CardTitle className="text-white">Current Balance</CardTitle>
                <CardDescription className="text-gray-400">
                  Available funds in your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    ${user.balance.toFixed(2)}
                  </div>
                  <p className="text-gray-400">USD Balance</p>
                </div>
              </CardContent>
            </Card>

            {/* Topup Form */}
            <Card className="bg-gray-900/50 border-purple-800/50">
              <CardHeader>
                <CardTitle className="text-white">Add Funds</CardTitle>
                <CardDescription className="text-gray-400">
                  Top up your account using cryptocurrency payments via Oxapay
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Amount Selection */}
                <div>
                  <Label className="text-gray-300 mb-3 block">Quick Select Amount</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {predefinedAmounts.map((preset) => (
                      <Button
                        key={preset}
                        variant={amount === preset.toString() ? 'default' : 'outline'}
                        onClick={() => setAmount(preset.toString())}
                        className={amount === preset.toString() 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white'
                        }
                      >
                        ${preset}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <Label htmlFor="amount" className="text-gray-300">Custom Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="5"
                    max="10000"
                    step="0.01"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-800/50 border-purple-700/50 text-white placeholder-gray-400"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Minimum: $5.00 • Maximum: $10,000.00
                  </p>
                </div>

                {/* Currency Selection */}
                <div>
                  <Label className="text-gray-300">Payment Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-gray-800/50 border-purple-700/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-purple-700/50">
                      <SelectItem value="USD">USD (Credit Card)</SelectItem>
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="LTC">Litecoin (LTC)</SelectItem>
                      <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Topup Button */}
                <Button
                  onClick={handleTopup}
                  disabled={!amount || parseFloat(amount) < 5 || isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  {isProcessing 
                    ? 'Processing Payment...' 
                    : `Add $${parseFloat(amount || '0').toFixed(2)} via ${currency}`
                  }
                </Button>

                {/* Payment Info */}
                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-400 text-xl">ℹ️</span>
                    <div>
                      <h4 className="text-blue-400 font-medium mb-2">Payment Information</h4>
                      <ul className="text-blue-200 text-sm space-y-1">
                        <li>• Payments are processed securely through Oxapay</li>
                        <li>• Cryptocurrency payments are usually confirmed within 10-30 minutes</li>
                        <li>• Credit card payments are processed instantly</li>
                        <li>• All transactions are encrypted and secure</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
              <CardDescription className="text-gray-400">
                Recent account activity and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-gray-400">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-400' :
                            transaction.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></span>
                          <h4 className="text-white font-medium">
                            {transaction.type === 'topup' ? 'Account Top-up' :
                             transaction.type === 'purchase' ? 'Purchase' : 'Refund'}
                          </h4>
                        </div>
                        <p className="text-gray-400 text-sm">{transaction.description}</p>
                        <p className="text-gray-500 text-xs">
                          {formatTransactionDate(transaction.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'topup' || transaction.type === 'refund'
                            ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'topup' || transaction.type === 'refund' ? '+' : ''}
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        } className={`text-xs ${
                          transaction.status === 'completed' ? 'bg-green-900 text-green-400' :
                          transaction.status === 'pending' ? 'bg-yellow-900 text-yellow-400' :
                          'bg-red-900 text-red-400'
                        }`}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}