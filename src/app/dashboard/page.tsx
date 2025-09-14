'use client'

import { useAuth } from '@/components/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/Navbar'
import { mockOrders, mockLicenses, mockTransactions, mockCustomOrders, mockProducts } from '@/lib/mockData'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

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

  // Get user-specific data
  const userOrders = mockOrders.filter(o => o.userId === user.id)
  const userLicenses = mockLicenses.filter(l => l.userId === user.id)
  const userTransactions = mockTransactions.filter(t => t.userId === user.id).slice(0, 5)
  const userCustomOrders = mockCustomOrders.filter(co => co.userId === user.id)

  const recentOrders = userOrders.slice(0, 3)
  const activeLicenses = userLicenses.filter(l => l.isActive)

  const stats = {
    totalOrders: userOrders.length,
    activeLicenses: activeLicenses.length,
    totalSpent: userTransactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    pendingCustomOrders: userCustomOrders.filter(co => co.status === 'chat' || co.status === 'in_development').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-300">
            Manage your software licenses, view order history, and track custom development projects.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Account Balance</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">${user.balance.toFixed(2)}</div>
              <Link href="/dashboard/balance">
                <Button variant="link" className="p-0 text-purple-300 hover:text-purple-200">
                  Top up balance →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Licenses</CardTitle>
              <span className="text-2xl">🔑</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeLicenses}</div>
              <Link href="/dashboard/licenses">
                <Button variant="link" className="p-0 text-purple-300 hover:text-purple-200">
                  View licenses →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Orders</CardTitle>
              <span className="text-2xl">📦</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
              <Link href="/dashboard/orders">
                <Button variant="link" className="p-0 text-purple-300 hover:text-purple-200">
                  View history →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Custom Projects</CardTitle>
              <span className="text-2xl">🛠️</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingCustomOrders}</div>
              {stats.pendingCustomOrders > 0 && (
                <Link href="/dashboard/custom-orders">
                  <Button variant="link" className="p-0 text-purple-300 hover:text-purple-200">
                    View projects →
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader>
              <CardTitle className="text-white">Recent Orders</CardTitle>
              <CardDescription className="text-gray-400">
                Your latest purchases and downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No orders yet</p>
                  <Link href="/shop">
                    <Button className="bg-gradient-to-r from-purple-600 to-purple-700">
                      Browse Software
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">
                          {order.items.map(item => item.product.name).join(', ')}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          order.status === 'completed' ? 'default' :
                          order.status === 'processing' ? 'secondary' : 'outline'
                        } className={
                          order.status === 'completed' ? 'bg-green-900 text-green-400' :
                          order.status === 'processing' ? 'bg-yellow-900 text-yellow-400' : ''
                        }>
                          {order.status}
                        </Badge>
                        <p className="text-white font-semibold mt-1">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link href="/dashboard/orders">
                    <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Licenses */}
          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader>
              <CardTitle className="text-white">Active Licenses</CardTitle>
              <CardDescription className="text-gray-400">
                Your current software licenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeLicenses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No active licenses</p>
                  <Link href="/shop?type=license">
                    <Button className="bg-gradient-to-r from-purple-600 to-purple-700">
                      Browse Licenses
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeLicenses.slice(0, 3).map((license) => {
                    const product = mockProducts.find(p => p.id === license.productId)
                    return (
                      <div key={license.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">
                            {product?.name || 'Unknown Product'}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Key: {license.licenseKey.substring(0, 16)}...
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-900 text-green-400 mb-1">
                            Active
                          </Badge>
                          {license.expiresAt && (
                            <p className="text-gray-400 text-xs">
                              Expires: {new Date(license.expiresAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  <Link href="/dashboard/licenses">
                    <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                      View All Licenses
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Custom Orders Section */}
        {userCustomOrders.length > 0 && (
          <Card className="bg-gray-900/50 border-purple-800/50 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Custom Development Projects</CardTitle>
              <CardDescription className="text-gray-400">
                Track your custom software development orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userCustomOrders.map((customOrder) => {
                  const product = mockProducts.find(p => p.id === customOrder.productId)
                  return (
                    <div key={customOrder.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">
                          {product?.name || 'Custom Software'}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {customOrder.specifications.substring(0, 80)}...
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className={
                          customOrder.status === 'completed' ? 'bg-green-900 text-green-400' :
                          customOrder.status === 'in_development' ? 'bg-blue-900 text-blue-400' :
                          customOrder.status === 'chat' ? 'bg-yellow-900 text-yellow-400' :
                          'bg-gray-700 text-gray-300'
                        }>
                          {customOrder.status.replace('_', ' ')}
                        </Badge>
                        <Link href={`/dashboard/chat/${customOrder.id}`}>
                          <Button variant="link" className="p-0 text-purple-300 hover:text-purple-200 text-sm">
                            View Chat →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="bg-gray-900/50 border-purple-800/50 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/shop">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  Browse Software
                </Button>
              </Link>
              <Link href="/dashboard/balance">
                <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Top Up Balance
                </Button>
              </Link>
              <Link href="/custom">
                <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Custom Development
                </Button>
              </Link>
              <Link href="/support">
                <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}