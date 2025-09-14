'use client'

import { useAuth } from '@/components/AuthProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/Navbar'
import { mockAdminStats } from '@/lib/mockData'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
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

  if (!user || user.role !== 'admin') {
    return null
  }

  const stats = mockAdminStats

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-300">
            Manage your software store, track sales, and oversee customer orders.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-gray-400 mt-2">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Orders</CardTitle>
              <span className="text-2xl">📦</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
              <p className="text-xs text-gray-400 mt-2">
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-xs text-gray-400 mt-2">
                +15.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Products</CardTitle>
              <span className="text-2xl">🛍️</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
              <p className="text-xs text-gray-400 mt-2">
                2 new this month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader>
              <CardTitle className="text-white">Recent Orders</CardTitle>
              <CardDescription className="text-gray-400">
                Latest customer purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">
                        Order #{order.id.substring(0, 8)}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {order.items.map(item => item.product.name).join(', ')}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleString()}
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
                <Link href="/admin/orders">
                  <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                    View All Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="bg-gray-900/50 border-purple-800/50">
            <CardHeader>
              <CardTitle className="text-white">Top Products</CardTitle>
              <CardDescription className="text-gray-400">
                Best-selling products this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.map((item, index) => (
                  <div key={item.product.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{item.product.name}</h4>
                        <p className="text-gray-400 text-sm">{item.salesCount} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${item.revenue.toFixed(2)}</p>
                      <Badge variant="outline" className="border-purple-700/50 text-purple-300 text-xs">
                        {item.product.type}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Link href="/admin/products">
                  <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                    Manage Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-900/50 border-purple-800/50 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Admin Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/products">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  Manage Products
                </Button>
              </Link>
              <Link href="/admin/orders">
                <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  View Orders
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/chat">
                <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Customer Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}