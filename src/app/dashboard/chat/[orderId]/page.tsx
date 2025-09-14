'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { mockCustomOrders, mockProducts } from '@/lib/mockData'
import { CustomOrder, Product } from '@/types'
import { toast } from 'sonner'

interface ChatPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const resolvedParams = await params
  const [customOrder, setCustomOrder] = useState<CustomOrder | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    // Find custom order
    const order = mockCustomOrders.find(co => co.id === resolvedParams.orderId)
    if (!order) {
      toast.error('Custom order not found')
      router.push('/dashboard')
      return
    }

    // Check if user has access
    if (user && user.role !== 'admin' && order.userId !== user.id) {
      toast.error('Unauthorized access')
      router.push('/dashboard')
      return
    }

    setCustomOrder(order)
    setMessages(order.chatMessages)

    // Find associated product
    const prod = mockProducts.find(p => p.id === order.productId)
    setProduct(prod || null)
  }, [user, isLoading, resolvedParams.orderId, router])

  const handleSendMessage = async () => {
    if (!message.trim() || !customOrder || !user) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      customOrderId: customOrder.id,
      senderId: user.id,
      senderRole: user.role as 'user' | 'admin',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      type: 'message' as const
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')

    // Simulate admin auto-response for demo
    if (user.role === 'user') {
      setTimeout(() => {
        const adminResponse = {
          id: `msg-${Date.now() + 1}`,
          customOrderId: customOrder.id,
          senderId: 'admin-1',
          senderRole: 'admin' as const,
          message: 'Thank you for your message! I\'ll review your requirements and get back to you shortly with more details.',
          timestamp: new Date().toISOString(),
          type: 'message' as const
        }
        setMessages(prev => [...prev, adminResponse])
      }, 2000)
    }

    toast.success('Message sent')
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
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

  if (!user || !customOrder) {
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
              <h1 className="text-3xl font-bold text-white mb-2">
                Custom Order Chat
              </h1>
              <p className="text-gray-300">
                {product?.name || 'Custom Software'} - Order #{customOrder.orderId}
              </p>
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

        {/* Project Info */}
        <div className="bg-gray-900/50 border border-purple-800/50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-purple-400 font-medium mb-2">Specifications:</h4>
              <p className="text-gray-300 bg-gray-800/30 p-3 rounded-lg">
                {customOrder.specifications}
              </p>
            </div>
            <div>
              <h4 className="text-purple-400 font-medium mb-2">Status:</h4>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  customOrder.status === 'completed' ? 'bg-green-900 text-green-400' :
                  customOrder.status === 'in_development' ? 'bg-blue-900 text-blue-400' :
                  customOrder.status === 'chat' ? 'bg-yellow-900 text-yellow-400' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {customOrder.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-gray-900/50 border border-purple-800/50 rounded-lg">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${
                msg.senderRole === 'user' && msg.senderId === user.id ? 'justify-end' : 'justify-start'
              }`}>
                <div className={`max-w-[70%] rounded-lg px-4 py-3 ${
                  msg.senderRole === 'user' && msg.senderId === user.id
                    ? 'bg-purple-600 text-white' 
                    : msg.senderRole === 'admin' 
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {msg.senderRole === 'admin' ? 'Admin' : 
                       msg.senderId === user.id ? 'You' : 'Customer'}
                    </span>
                    <span className="text-xs opacity-70">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Message Input */}
          {customOrder.status !== 'completed' && (
            <div className="border-t border-purple-800/50 p-6">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-grow px-4 py-2 bg-gray-800/50 border border-purple-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  Send
                </Button>
              </div>
              
              {user.role === 'admin' && (
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                  >
                    Request Payment
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                  >
                    Mark Complete
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {customOrder.status === 'completed' && (
          <div className="mt-8 bg-green-900/20 border border-green-800/50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Project Completed!</h3>
            <p className="text-green-300">
              Your custom software has been delivered successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}