'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/AuthProvider'
import { useCart } from '@/components/CartProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Navbar() {
  const { user, logout } = useAuth()
  const { getItemCount } = useCart()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-purple-800/50 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              PrivateInstance
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/shop" className="text-gray-300 hover:text-purple-400 transition-colors">
                Shop
              </Link>
              <Link href="/categories" className="text-gray-300 hover:text-purple-400 transition-colors">
                Categories
              </Link>
              <Link href="/custom" className="text-gray-300 hover:text-purple-400 transition-colors">
                Custom Development
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Cart Button */}
                <Link href="/cart" className="relative">
                  <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                    Cart
                    {getItemCount() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-purple-600 text-white text-xs">
                        {getItemCount()}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {user.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-purple-800/50" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">Balance:</span>
                        <span className="text-sm font-semibold text-purple-400">${user.balance.toFixed(2)}</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-purple-800/50" />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer text-gray-300 hover:text-white">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/licenses" className="cursor-pointer text-gray-300 hover:text-white">
                        My Licenses
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/orders" className="cursor-pointer text-gray-300 hover:text-white">
                        Order History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/balance" className="cursor-pointer text-gray-300 hover:text-white">
                        Top Up Balance
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator className="bg-purple-800/50" />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer text-purple-400 hover:text-purple-300">
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-purple-800/50" />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}