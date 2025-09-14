import { NextRequest, NextResponse } from 'next/server'
import { mockOrders, mockUsers, mockCustomOrders, mockLicenses } from '@/lib/mockData'
import { Order, CustomOrder, License } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    
    let filteredOrders = [...mockOrders]
    
    // Filter by user ID
    if (userId) {
      filteredOrders = filteredOrders.filter(o => o.userId === userId)
    }
    
    // Filter by status
    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(o => o.status === status)
    }
    
    // Sort by creation date (newest first)
    filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json({
      success: true,
      data: filteredOrders,
      total: filteredOrders.length
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch orders'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, promoCode } = body
    
    // Validate user exists
    const user = mockUsers.find(u => u.id === userId)
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }
    
    // Calculate totals
    const subtotal = items.reduce((total: number, item: { product: { price: number }, quantity: number }) => 
      total + (item.product.price * item.quantity), 0
    )
    
    let discount = 0
    // Apply promo code if provided (simplified validation)
    if (promoCode) {
      // In real app, validate promo code properly
      discount = subtotal * 0.1 // 10% discount for demo
    }
    
    const totalAmount = subtotal - discount
    
    // Check user balance
    if (user.balance < totalAmount) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient balance'
      }, { status: 400 })
    }
    
    // Create new order
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId,
      items,
      totalAmount,
      discount,
      promoCode,
      status: 'pending',
      paymentMethod: 'balance',
      createdAt: new Date().toISOString()
    }
    
    // Process order items
    for (const item of items) {
      if (item.product.type === 'license') {
        // Create license for license products
        const license: License = {
          id: `license-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          orderId: newOrder.id,
          userId,
          productId: item.product.id,
          licenseKey: `${item.product.name.toUpperCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 12)}`,
          downloadUrl: item.product.downloadUrl || 'https://example.com/download',
          expiresAt: item.product.name.includes('Lifetime') ? undefined : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          maxActivations: 3,
          currentActivations: 0,
          createdAt: new Date().toISOString()
        }
        
        mockLicenses.push(license)
        
        // Update order with delivery info
        newOrder.deliveryInfo = {
          licenseKey: license.licenseKey,
          downloadUrl: license.downloadUrl,
          expiresAt: license.expiresAt
        }
        newOrder.status = 'completed'
        newOrder.completedAt = new Date().toISOString()
        
      } else if (item.product.type === 'custom') {
        // Create custom order for custom products
        const customOrder: CustomOrder = {
          id: `custom-${Date.now()}`,
          orderId: newOrder.id,
          userId,
          productId: item.product.id,
          status: 'chat',
          specifications: item.customSpecs || 'No specifications provided',
          additionalPaymentRequests: [],
          chatMessages: [{
            id: `msg-${Date.now()}`,
            customOrderId: `custom-${Date.now()}`,
            senderId: userId,
            senderRole: 'user',
            message: `I would like to order: ${item.product.name}\n\nSpecifications: ${item.customSpecs || 'Please contact me to discuss requirements.'}`,
            timestamp: new Date().toISOString(),
            type: 'message'
          }],
          createdAt: new Date().toISOString()
        }
        
        mockCustomOrders.push(customOrder)
        newOrder.status = 'processing'
      }
    }
    
    // Add order to mock data
    mockOrders.push(newOrder)
    
    // Update user balance (in real app, this would be a transaction)
    const userIndex = mockUsers.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      mockUsers[userIndex].balance -= totalAmount
    }
    
    return NextResponse.json({
      success: true,
      data: newOrder,
      message: 'Order placed successfully'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create order'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status, deliveryInfo } = body
    
    const orderIndex = mockOrders.findIndex(o => o.id === orderId)
    if (orderIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 })
    }
    
    // Update order
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status,
      deliveryInfo: deliveryInfo || mockOrders[orderIndex].deliveryInfo,
      updatedAt: new Date().toISOString(),
      ...(status === 'completed' && { completedAt: new Date().toISOString() })
    }
    
    return NextResponse.json({
      success: true,
      data: mockOrders[orderIndex],
      message: 'Order updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update order'
    }, { status: 500 })
  }
}