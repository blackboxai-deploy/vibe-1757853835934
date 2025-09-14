'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { mockProducts } from '@/lib/mockData'
import { useCart } from '@/components/CartProvider'
import { Navbar } from '@/components/Navbar'
import { Product } from '@/types'

export default function ShopPage() {
  const [products] = useState<Product[]>(mockProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null)
  const { addItem } = useCart()

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)))

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      const matchesType = typeFilter === 'all' || product.type === typeFilter
      return matchesSearch && matchesCategory && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleAddToCart = async (product: Product) => {
    setLoadingProduct(product.id)
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addItem(product)
    setLoadingProduct(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Software <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Shop</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Browse our extensive collection of premium software licenses and request custom development solutions
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 bg-gray-900/30 rounded-lg border border-purple-800/30 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800/50 border-purple-700/50 text-white placeholder-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-gray-800/50 border-purple-700/50 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-700/50">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-gray-800/50 border-purple-700/50 text-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-700/50">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="license">License Keys</SelectItem>
                  <SelectItem value="custom">Custom Software</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-800/50 border-purple-700/50 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-purple-700/50">
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
            <Button 
              onClick={() => {
                setSearchQuery('')
                setCategoryFilter('all')
                setTypeFilter('all')
              }}
              variant="outline" 
              className="mt-4 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-gray-900/50 border-purple-800/50 hover:border-purple-600/70 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                <CardHeader>
                  <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className={`${
                      product.type === 'license' 
                        ? 'bg-green-900/50 text-green-400 border-green-800' 
                        : 'bg-blue-900/50 text-blue-400 border-blue-800'
                    }`}>
                      {product.type === 'license' ? 'License' : 'Custom'}
                    </Badge>
                    <Badge variant="outline" className="border-purple-700/50 text-purple-300">
                      {product.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-gray-400 line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-purple-400">
                      ${product.price.toFixed(2)}
                    </div>
                    
                    {product.type === 'license' && product.stockCount && (
                      <div className="text-sm text-gray-400">
                        {product.stockCount > 10 ? (
                          <span className="text-green-400">In Stock</span>
                        ) : (
                          <span className="text-yellow-400">Only {product.stockCount} left</span>
                        )}
                      </div>
                    )}
                    
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
                      Details
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
        )}

        {/* Load More (Future Enhancement) */}
        {filteredProducts.length >= 12 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
              disabled
            >
              Load More Products (Coming Soon)
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}