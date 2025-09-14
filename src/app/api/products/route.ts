import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    
    let filteredProducts = [...mockProducts]
    
    // Apply filters
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }
    
    if (type && type !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.type === type)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.features.some(f => f.toLowerCase().includes(searchLower))
      )
    }
    
    return NextResponse.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, description, price, type, category, features } = body
    
    if (!name || !description || !price || !type || !category || !features) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }
    
    // Create new product (in real app, this would save to database)
    const newProduct = {
      id: `product-${Date.now()}`,
      name,
      description,
      price: parseFloat(price),
      type,
      category,
      image: body.image || 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b7e3d6a4-d609-481b-8343-7ce3349c638a.png',
      inStock: true,
      stockCount: body.stockCount || (type === 'license' ? 100 : undefined),
      downloadUrl: body.downloadUrl,
      features: Array.isArray(features) ? features : [features],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // In real app, save to database
    mockProducts.push(newProduct)
    
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create product'
    }, { status: 500 })
  }
}