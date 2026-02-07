"use client"

import { useState, useMemo, Suspense, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Store, Search, Plus, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for marketplace items
const mockItems = [
  {
    id: 1,
    title: "Fresh Vegetables Bundle",
    price: 150,
    seller: "Local Farm",
    category: "Food",
    image: "🥬",
    condition: "New",
  },
  {
    id: 2,
    title: "Handmade Bamboo Crafts",
    price: 350,
    seller: "Artisan Coop",
    category: "Crafts",
    image: "🎋",
    condition: "New",
  },
  {
    id: 3,
    title: "Pre-loved Study Table",
    price: 800,
    seller: "Maria Santos",
    category: "Furniture",
    image: "🪑",
    condition: "Good",
  },
  {
    id: 4,
    title: "Homemade Banana Bread",
    price: 120,
    seller: "Home Baker",
    category: "Food",
    image: "🍞",
    condition: "New",
  },
  {
    id: 5,
    title: "Kids Bicycle",
    price: 1500,
    seller: "Juan Cruz",
    category: "Sports",
    image: "🚲",
    condition: "Used",
  },
  {
    id: 6,
    title: "Smartphone - Samsung",
    price: 3500,
    seller: "Tech Reseller",
    category: "Electronics",
    image: "📱",
    condition: "Good",
  },
  {
    id: 7,
    title: "Vintage T-Shirt",
    price: 200,
    seller: "Thrift Shop",
    category: "Clothing",
    image: "👕",
    condition: "Used",
  },
  {
    id: 8,
    title: "Basketball Shoes",
    price: 2500,
    seller: "Sports Center",
    category: "Sports",
    image: "👟",
    condition: "New",
  },
  {
    id: 9,
    title: "Wooden Bookshelf",
    price: 1200,
    seller: "Carpenter John",
    category: "Furniture",
    image: "📚",
    condition: "New",
  },
  {
    id: 10,
    title: "Fresh Fish - Tilapia",
    price: 180,
    seller: "Fisherman's Catch",
    category: "Food",
    image: "🐟",
    condition: "New",
  },
  {
    id: 11,
    title: "Handwoven Basket",
    price: 280,
    seller: "Local Artisan",
    category: "Crafts",
    image: "🧺",
    condition: "New",
  },
  {
    id: 12,
    title: "Office Chair",
    price: 1500,
    seller: "Furniture Store",
    category: "Furniture",
    image: "💺",
    condition: "Good",
  },
]

const categories = ["All", "Food", "Crafts", "Furniture", "Electronics", "Sports", "Clothing"]

function MarketplaceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const urlCategory = searchParams.get("category")
  const urlSearch = searchParams.get("q")
  
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || "All")
  const [searchInput, setSearchInput] = useState(urlSearch || "")
  const [activeSearch, setActiveSearch] = useState(urlSearch || "")

  // Update state when URL changes
  useEffect(() => {
    if (urlSearch) {
      setSearchInput(urlSearch)
      setActiveSearch(urlSearch)
    }
    if (urlCategory) {
      setSelectedCategory(urlCategory)
    }
  }, [urlSearch, urlCategory])

  const filteredItems = useMemo(() => {
    return mockItems.filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
      const matchesSearch = !activeSearch || 
        item.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
        item.seller.toLowerCase().includes(activeSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(activeSearch.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, activeSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveSearch(searchInput)
    
    // Update URL with search query
    const params = new URLSearchParams(searchParams)
    if (searchInput) {
      params.set("q", searchInput)
    } else {
      params.delete("q")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    
    // Update URL with category
    const params = new URLSearchParams(searchParams)
    if (activeSearch) {
      params.set("q", activeSearch)
    }
    if (category !== "All") {
      params.set("category", category)
    } else {
      params.delete("category")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearchInput("")
    setActiveSearch("")
    const params = new URLSearchParams(searchParams)
    params.delete("q")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <Store className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BarangayMo
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link href="/marketplace" className="text-sm font-medium text-blue-600">
              Marketplace
            </Link>
            <Link href="/announcements" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              News
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/marketplace/sell">Sell Item</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Community Marketplace
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Buy, sell, and trade with your neighbors. Support local businesses and find great deals in your barangay.
          </p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search items, sellers, or categories..." 
                className="pl-10 pr-10 h-12 bg-white text-gray-900"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button type="submit" size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-8">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-4 bg-white border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={selectedCategory === category ? "bg-blue-600" : ""}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Search Results Info */}
      {(activeSearch || selectedCategory !== "All") && (
        <section className="py-4 px-4 bg-blue-50 border-b">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <p className="text-blue-800">
                {activeSearch && (
                  <span>Searching for &quot;<strong>{activeSearch}</strong>&quot;</span>
                )}
                {activeSearch && selectedCategory !== "All" && (
                  <span> in </span>
                )}
                {selectedCategory !== "All" && (
                  <span>category &quot;<strong>{selectedCategory}</strong>&quot;</span>
                )}
                <span className="ml-2">({filteredItems.length} results)</span>
              </p>
              <Button variant="ghost" size="sm" onClick={() => {clearSearch(); handleCategoryClick("All")}}>
                Clear filters
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Items Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeSearch ? "Search Results" : selectedCategory === "All" ? "Featured Items" : `${selectedCategory} Items`}
              <span className="text-lg font-normal text-gray-500 ml-2">
                ({filteredItems.length})
              </span>
            </h2>
            <Link href="/marketplace/sell">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Sell Something
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <Link href={`/marketplace/${item.id}`} className="block">
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-6xl mb-4 group-hover:from-blue-50 group-hover:to-blue-100 transition-colors">
                      {item.image}
                    </div>
                  </Link>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                      <Link href={`/marketplace/${item.id}`}>
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors cursor-pointer">
                          {item.title}
                        </CardTitle>
                      </Link>
                    </div>
                    <span className="text-lg font-bold text-blue-600">₱{item.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Seller: {item.seller}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">{item.condition}</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline" asChild>
                    <Link href={`/marketplace/${item.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <Store className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeSearch ? "No items found" : "No items yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {activeSearch 
                  ? `We couldn't find any items matching "${activeSearch}". Try different keywords.`
                  : "Be the first to sell something in your community!"}
              </p>
              {activeSearch ? (
                <Button variant="outline" onClick={clearSearch}>
                  Clear Search
                </Button>
              ) : (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/marketplace/sell">Start Selling</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm text-gray-500">
            © 2026 BarangayMo Marketplace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  )
}
