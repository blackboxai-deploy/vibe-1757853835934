import { NextRequest, NextResponse } from 'next/server'
import { mockUsers } from '@/lib/mockData'
import { LoginForm, RegisterForm, User } from '@/types'

// POST /api/auth - Handle login and registration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    if (action === 'login') {
      return handleLogin(data as LoginForm)
    } else if (action === 'register') {
      return handleRegister(data as RegisterForm)
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}

async function handleLogin(credentials: LoginForm) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Find user by email
  const user = mockUsers.find(u => u.email === credentials.email)
  
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    )
  }

  // In a real application, you would verify the password hash
  // For demo purposes, we'll accept any password for existing users
  const isValidPassword = credentials.password.length >= 6
  
  if (!isValidPassword) {
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  }

  // Remove sensitive data before sending response
  const { ...userData } = user
  
  return NextResponse.json({
    success: true,
    data: {
      user: userData,
      token: `jwt-token-${user.id}`, // Mock JWT token
    }
  })
}

async function handleRegister(userData: RegisterForm) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))

  // Validate passwords match
  if (userData.password !== userData.confirmPassword) {
    return NextResponse.json(
      { success: false, error: 'Passwords do not match' },
      { status: 400 }
    )
  }

  // Check if user already exists
  const existingUser = mockUsers.find(
    u => u.email === userData.email || u.username === userData.username
  )
  
  if (existingUser) {
    return NextResponse.json(
      { success: false, error: 'User already exists with this email or username' },
      { status: 409 }
    )
  }

  // Validate password strength
  if (userData.password.length < 6) {
    return NextResponse.json(
      { success: false, error: 'Password must be at least 6 characters long' },
      { status: 400 }
    )
  }

  // Create new user
  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email: userData.email,
    username: userData.username,
    balance: 0,
    role: 'user',
    createdAt: new Date().toISOString()
  }

  // In a real application, you would save this to a database
  // For now, we'll just simulate successful registration
  
  return NextResponse.json({
    success: true,
    data: {
      user: newUser,
      token: `jwt-token-${newUser.id}`,
    },
    message: 'Account created successfully'
  })
}

// GET /api/auth - Verify authentication token
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, error: 'No token provided' },
      { status: 401 }
    )
  }

  const token = authHeader.split(' ')[1]
  
  // Mock token validation
  if (!token.startsWith('jwt-token-')) {
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    )
  }

  // Extract user ID from token (in real app, you'd decode JWT)
  const userId = token.replace('jwt-token-', '')
  const user = mockUsers.find(u => u.id === userId)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    data: { user }
  })
}

// DELETE /api/auth - Logout (invalidate token)
export async function DELETE() {
  // In a real application, you would invalidate the JWT token
  // or remove it from a token blacklist/whitelist
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })
}