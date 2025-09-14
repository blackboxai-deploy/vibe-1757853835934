import { NextRequest, NextResponse } from 'next/server'
import { mockCustomOrders } from '@/lib/mockData'
import { ChatMessage, PaymentRequest } from '@/types'

// GET /api/chat - Get chat messages for a custom order
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customOrderId = searchParams.get('customOrderId')
  const userId = searchParams.get('userId')

  if (!customOrderId) {
    return NextResponse.json(
      { success: false, error: 'Custom order ID is required' },
      { status: 400 }
    )
  }

  try {
    // Find the custom order
    const customOrder = mockCustomOrders.find(co => co.id === customOrderId)
    
    if (!customOrder) {
      return NextResponse.json(
        { success: false, error: 'Custom order not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this chat (either owner or admin)
    if (userId && customOrder.userId !== userId) {
      // In a real app, you'd also check if the user is an admin
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        customOrder,
        messages: customOrder.chatMessages
      }
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chat messages' },
      { status: 500 }
    )
  }
}

// POST /api/chat - Send a new message or create payment request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customOrderId, senderId, senderRole, message, type, paymentAmount, paymentDescription } = body

    if (!customOrderId || !senderId || !senderRole) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find the custom order
    const customOrder = mockCustomOrders.find(co => co.id === customOrderId)
    
    if (!customOrder) {
      return NextResponse.json(
        { success: false, error: 'Custom order not found' },
        { status: 404 }
      )
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (type === 'payment_request' && senderRole === 'admin') {
      // Create payment request
      const paymentRequest: PaymentRequest = {
        id: `payment-${Date.now()}`,
        customOrderId,
        amount: paymentAmount,
        description: paymentDescription,
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      // Add payment request to custom order
      customOrder.additionalPaymentRequests.push(paymentRequest)

      // Create system message for payment request
      const systemMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        customOrderId,
        senderId: 'system',
        senderRole: 'admin',
        message: `Payment request created: $${paymentAmount} - ${paymentDescription}`,
        timestamp: new Date().toISOString(),
        type: 'payment_request'
      }

      customOrder.chatMessages.push(systemMessage)

      return NextResponse.json({
        success: true,
        data: {
          paymentRequest,
          message: systemMessage
        },
        message: 'Payment request created successfully'
      })
    } else {
      // Create regular message
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customOrderId,
        senderId,
        senderRole,
        message,
        timestamp: new Date().toISOString(),
        type: type || 'message'
      }

      // Add message to custom order
      customOrder.chatMessages.push(newMessage)

      return NextResponse.json({
        success: true,
        data: { message: newMessage },
        message: 'Message sent successfully'
      })
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// PATCH /api/chat - Update custom order status or complete project
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { customOrderId, status, completionInfo, senderId, senderRole } = body

    if (!customOrderId || !senderId || !senderRole) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find the custom order
    const customOrder = mockCustomOrders.find(co => co.id === customOrderId)
    
    if (!customOrder) {
      return NextResponse.json(
        { success: false, error: 'Custom order not found' },
        { status: 404 }
      )
    }

    // Only admin can update status
    if (senderRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Only administrators can update order status' },
        { status: 403 }
      )
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update order status
    if (status) {
      customOrder.status = status
      
      if (status === 'completed') {
        customOrder.completedAt = new Date().toISOString()
        if (completionInfo) {
          customOrder.completionInfo = completionInfo
        }
      }
    }

    // Create system message for status update
    const systemMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      customOrderId,
      senderId: 'system',
      senderRole: 'admin',
      message: `Order status updated to: ${status}${status === 'completed' ? '. Project completed!' : ''}`,
      timestamp: new Date().toISOString(),
      type: 'system'
    }

    customOrder.chatMessages.push(systemMessage)

    return NextResponse.json({
      success: true,
      data: {
        customOrder,
        message: systemMessage
      },
      message: 'Order status updated successfully'
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}