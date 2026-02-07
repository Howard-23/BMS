"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Store, ArrowLeft, MapPin, Clock, Shield, User, MessageCircle, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// Mock data - same as marketplace page
const mockItems = [
  {
    id: 1,
    title: "Fresh Vegetables Bundle",
    price: 150,
    seller: "Local Farm",
    category: "Food",
    image: "🥬",
    condition: "New",
    description: "Fresh assortment of vegetables including pechay, kangkong, tomatoes, and eggplant. Harvested daily from our local farm. Perfect for a healthy family meal.",
    location: "Barangay Market",
    postedDate: "2 hours ago",
  },
  {
    id: 2,
    title: "Handmade Bamboo Crafts",
    price: 350,
    seller: "Artisan Coop",
    category: "Crafts",
    image: "🎋",
    condition: "New",
    description: "Beautiful handmade bamboo products crafted by local artisans. Includes decorative items and functional pieces for your home.",
    location: "Artisan Center",
    postedDate: "1 day ago",
  },
  {
    id: 3,
    title: "Pre-loved Study Table",
    price: 800,
    seller: "Maria Santos",
    category: "Furniture",
    image: "🪑",
    condition: "Good",
    description: "Study table in good condition. Minor scratches but fully functional. Perfect for students. Dimensions: 120cm x 60cm x 75cm.",
    location: "Purok 3",
    postedDate: "3 days ago",
  },
  {
    id: 4,
    title: "Homemade Banana Bread",
    price: 120,
    seller: "Home Baker",
    category: "Food",
    image: "🍞",
    condition: "New",
    description: "Delicious homemade banana bread made with love. Freshly baked daily using quality ingredients. Available in whole loaf or sliced.",
    location: "Main Street",
    postedDate: "5 hours ago",
  },
  {
    id: 5,
    title: "Kids Bicycle",
    price: 1500,
    seller: "Juan Cruz",
    category: "Sports",
    image: "🚲",
    condition: "Used",
    description: "Kids bicycle suitable for ages 6-10. Recently tuned up with new brakes and tires. Minor scratches from normal use.",
    location: "Purok 5",
    postedDate: "1 week ago",
  },
  {
    id: 6,
    title: "Smartphone - Samsung",
    price: 3500,
    seller: "Tech Reseller",
    category: "Electronics",
    image: "📱",
    condition: "Good",
    description: "Samsung Galaxy A32 in good working condition. 128GB storage, 6GB RAM. Comes with charger and case. No scratches on screen.",
    location: "Digital Plaza",
    postedDate: "2 days ago",
  },
  {
    id: 7,
    title: "Vintage T-Shirt",
    price: 200,
    seller: "Thrift Shop",
    category: "Clothing",
    image: "👕",
    condition: "Used",
    description: "Vintage style t-shirt in good condition. Size Medium. Unique design, perfect for casual wear.",
    location: "Thrift Store, Main Road",
    postedDate: "4 days ago",
  },
  {
    id: 8,
    title: "Basketball Shoes",
    price: 2500,
    seller: "Sports Center",
    category: "Sports",
    image: "👟",
    condition: "New",
    description: "Brand new basketball shoes. Size 10. Excellent grip and ankle support. Original packaging included.",
    location: "Sports Complex",
    postedDate: "6 hours ago",
  },
  {
    id: 9,
    title: "Wooden Bookshelf",
    price: 1200,
    seller: "Carpenter John",
    category: "Furniture",
    image: "📚",
    condition: "New",
    description: "Handcrafted wooden bookshelf made from quality hardwood. 4 shelves, sturdy construction. Dimensions: 150cm x 80cm x 30cm.",
    location: "Woodwork Shop",
    postedDate: "3 days ago",
  },
  {
    id: 10,
    title: "Fresh Fish - Tilapia",
    price: 180,
    seller: "Fisherman's Catch",
    category: "Food",
    image: "🐟",
    condition: "New",
    description: "Fresh tilapia caught this morning. Cleaned and ready to cook. Available per kilo. Best for sinigang or fried fish.",
    location: "Fish Market",
    postedDate: "1 hour ago",
  },
  {
    id: 11,
    title: "Handwoven Basket",
    price: 280,
    seller: "Local Artisan",
    category: "Crafts",
    image: "🧺",
    condition: "New",
    description: "Traditional handwoven basket perfect for storage or decoration. Made from local materials. Various sizes available.",
    location: "Craft Market",
    postedDate: "2 days ago",
  },
  {
    id: 12,
    title: "Office Chair",
    price: 1500,
    seller: "Furniture Store",
    category: "Furniture",
    image: "💺",
    condition: "Good",
    description: "Ergonomic office chair with adjustable height and lumbar support. Comfortable for long hours of work.",
    location: "Furniture District",
    postedDate: "5 days ago",
  },
]

function ItemDetailContent() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<typeof mockItems[0] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const itemId = parseInt(params.id as string)
    const foundItem = mockItems.find(i => i.id === itemId)
    
    if (foundItem) {
      setItem(foundItem)
    }
    setLoading(false)
  }, [params.id])

  const handleContactSeller = () => {
    toast.success(`Contact request sent to ${item?.seller}!`)
  }

  const handleReportItem = () => {
    toast.success("Item reported. Thank you for helping keep our marketplace safe.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Item Not Found</h1>
          <p className="text-gray-500 mb-4">The item you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    )
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
          <Button variant="ghost" size="sm" asChild>
            <Link href="/marketplace">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
            <span className="text-9xl">{item.image}</span>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{item.category}</Badge>
              <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
              <p className="text-3xl font-bold text-blue-600">₱{item.price}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {item.postedDate}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {item.location}
              </span>
            </div>

            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold mb-2">Condition</h2>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>{item.condition}</span>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.seller}</p>
                    <p className="text-sm text-gray-500">Verified Seller</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button className="flex-1 h-12 text-lg" onClick={handleContactSeller}>
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Seller
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={handleReportItem}>
                <Flag className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Always meet in public places and verify items before payment
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ItemDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ItemDetailContent />
    </Suspense>
  )
}
