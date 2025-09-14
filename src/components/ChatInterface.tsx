'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/components/AuthProvider'
import { CustomOrder } from '@/types'
import { toast } from 'sonner'

interface ChatInterfaceProps {
  customOrder: CustomOrder
  onSendMessage?: (message: string) => void
  onPaymentRequest?: (amount: number, description: string) => void
  onMarkComplete?: () => void
}

export function ChatInterface({ customOrder, onSendMessage, onPaymentRequest, onMarkComplete }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [newMessage, setNewMessage] = useState('')
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDescription, setPaymentDescription] = useState('')
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [customOrder.chatMessages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    // In a real app, this would make an API call
    onSendMessage?.(newMessage.trim())
    setNewMessage('')
    toast.success('Message sent')
  }

  const handlePaymentRequest = async () => {
    if (!paymentAmount || !paymentDescription.trim()) {
      toast.error('Please fill in all payment request fields')
      return
    }

    const amount = parseFloat(paymentAmount)
    if (amount <= 0) {
      toast.error('Payment amount must be greater than 0')
      return
    }

    onPaymentRequest?.(amount, paymentDescription.trim())
    setPaymentAmount('')
    setPaymentDescription('')
    setShowPaymentForm(false)
    toast.success('Payment request sent')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getStatusBadge = (status: CustomOrder['status']) => {
    const statusConfig = {
      chat: { color: 'bg-yellow-900 text-yellow-400', label: 'In Discussion' },
      specs_approved: { color: 'bg-blue-900 text-blue-400', label: 'Specs Approved' },
      in_development: { color: 'bg-purple-900 text-purple-400', label: 'In Development' },
      completed: { color: 'bg-green-900 text-green-400', label: 'Completed' }
    }
    return statusConfig[status] || statusConfig.chat
  }

  const statusBadge = getStatusBadge(customOrder.status)

  return (
    <div className="space-y-6">
      {/* Order Status */}
      <Card className="bg-gray-900/50 border-purple-800/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Custom Order #{customOrder.id.substring(0, 8).toUpperCase()}</CardTitle>
              <CardDescription className="text-gray-400">
                {customOrder.specifications}
              </CardDescription>
            </div>
            <Badge className={statusBadge.color}>
              {statusBadge.label}
            </Badge>
          </div>
        </CardHeader>
        
        {customOrder.additionalPaymentRequests.length > 0 && (
          <CardContent>
            <Separator className="mb-4 bg-purple-800/50" />
            <h4 className="text-white font-medium mb-3">Payment Requests</h4>
            <div className="space-y-2">
              {customOrder.additionalPaymentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div>
                    <p className="text-white font-medium">${request.amount.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">{request.description}</p>
                  </div>
                  <Badge variant={request.status === 'paid' ? 'default' : 'outline'} className={
                    request.status === 'paid' ? 'bg-green-900 text-green-400' :
                    request.status === 'pending' ? 'bg-yellow-900 text-yellow-400' :
                    'bg-red-900 text-red-400'
                  }>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Chat Messages */}
      <Card className="bg-gray-900/50 border-purple-800/50">
        <CardHeader>
          <CardTitle className="text-white">Project Discussion</CardTitle>
          <CardDescription className="text-gray-400">
            Collaborate with our team to define your requirements
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {customOrder.chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.senderRole === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-sm lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderRole === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs opacity-75">
                      {message.senderRole === 'admin' ? 'Admin' : 'You'}
                    </span>
                    <span className="text-xs opacity-60">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  
                  {message.type === 'payment_request' ? (
                    <div className="border border-yellow-500/30 rounded p-2 bg-yellow-900/20">
                      <p className="text-yellow-400 font-medium">Payment Request</p>
                      <p className="text-white">{message.message}</p>
                    </div>
                  ) : message.type === 'system' ? (
                    <div className="italic text-blue-300">
                      {message.message}
                    </div>
                  ) : (
                    <p>{message.message}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="mt-4 space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-gray-800/50 border-purple-700/50 text-white placeholder-gray-400"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                Send
              </Button>
            </div>

            {/* Admin Controls */}
            {user?.role === 'admin' && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
                >
                  Request Payment
                </Button>
                
                {customOrder.status !== 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onMarkComplete}
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                  >
                    Mark as Complete
                  </Button>
                )}
              </div>
            )}

            {/* Payment Request Form */}
            {showPaymentForm && user?.role === 'admin' && (
              <Card className="bg-gray-800/50 border-orange-700/50">
                <CardHeader>
                  <CardTitle className="text-orange-400 text-lg">Request Additional Payment</CardTitle>
                  <CardDescription className="text-gray-400">
                    Request additional payment for extra features or changes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm">Amount ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="bg-gray-700/50 border-orange-600/50 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Description</label>
                    <Input
                      placeholder="Reason for additional payment..."
                      value={paymentDescription}
                      onChange={(e) => setPaymentDescription(e.target.value)}
                      className="bg-gray-700/50 border-orange-600/50 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handlePaymentRequest}
                      className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                    >
                      Send Request
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentForm(false)}
                      className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completion Info */}
      {customOrder.status === 'completed' && customOrder.completionInfo && (
        <Card className="bg-gray-900/50 border-green-800/50">
          <CardHeader>
            <CardTitle className="text-green-400">Project Completed</CardTitle>
            <CardDescription className="text-gray-400">
              Your custom software is ready
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: customOrder.completionInfo }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}