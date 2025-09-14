'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockProducts } from '@/lib/mockData'
import { useAuth } from '@/components/AuthProvider'
import { useCart } from '@/components/CartProvider'
import { useState } from 'react'
import { Product } from '@/types'

export default function HomePage() {
  const { user } = useAuth()
  const { addItem } = useCart()
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null)

  const featuredProducts = mockProducts.slice(0, 3)

  const handleAddToCart = async (product: Product) => {
    setLoadingProduct(product.id)
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addItem(product)
    setLoadingProduct(null)
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-purple-800/50 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                PrivateInstance
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/shop" className="text-gray-300 hover:text-purple-400 transition-colors">
                Shop
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-purple-400 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-purple-400 transition-colors">
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                      Cart
                    </Button>
                  </Link>
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

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent">
                Premium Software
              </span>
              <br />
              <span className="text-white">
                & Custom Solutions
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Get instant access to premium software licenses or order custom-built solutions 
              tailored specifically to your needs. Professional quality, competitive prices, instant delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-lg px-8 py-3">
                  Browse Software
                </Button>
              </Link>
              <Link href="/custom">
                <Button size="lg" variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white text-lg px-8 py-3">
                  Custom Development
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Choose PrivateInstance?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We provide professional-grade software solutions with instant delivery and exceptional support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Delivery</h3>
              <p className="text-gray-400">License keys and download links delivered immediately after purchase</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure Payments</h3>
              <p className="text-gray-400">Cryptocurrency payments with advanced security measures</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Custom Development</h3>
              <p className="text-gray-400">Bespoke software solutions built to your exact specifications</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-400">Direct communication with our development team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Featured Software
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Popular licenses and custom solutions trusted by professionals worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="bg-gray-900/50 border-purple-800/50 hover:border-purple-600/70 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                <CardHeader>
                  <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className={`${
                      product.type === 'license' 
                        ? 'bg-green-900/50 text-green-400 border-green-800' 
                        : 'bg-blue-900/50 text-blue-400 border-blue-800'
                    }`}>
                      {product.type === 'license' ? 'License' : 'Custom'}
                    </Badge>
                  </div>
                  <CardTitle className="text-white">{product.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-400">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-purple-700/50 text-purple-300">
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 3 && (
                        <Badge variant="outline" className="text-xs border-purple-700/50 text-purple-300">
                          +{product.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-2">
                  <Link href={`/product/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingProduct === product.id}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    {loadingProduct === product.id ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-black/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust PrivateInstance for their software needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                Start Shopping
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-purple-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                PrivateInstance
              </h3>
              <p className="text-gray-400">
                Your trusted source for premium software licenses and custom development solutions.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><Link href="/shop" className="text-gray-400 hover:text-purple-400">Software Licenses</Link></li>
                <li><Link href="/custom" className="text-gray-400 hover:text-purple-400">Custom Development</Link></li>
                <li><Link href="/categories" className="text-gray-400 hover:text-purple-400">Categories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-purple-400">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-purple-400">Contact Us</Link></li>
                <li><Link href="/docs" className="text-gray-400 hover:text-purple-400">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-purple-400">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-purple-400">Terms of Service</Link></li>
                <li><Link href="/refund" className="text-gray-400 hover:text-purple-400">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-800/50 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 PrivateInstance. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}