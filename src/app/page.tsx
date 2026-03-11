export const dynamic = 'force-dynamic'

import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  ArrowRight, 
  Store, 
  MessageCircle, 
  Bell, 
  MapPin,
  ChevronRight,
  Star,
  TrendingUp,
  ShoppingBag,
  Heart
} from "lucide-react"
import { formatDate } from "@/lib/utils"

async function getHomePageData() {
  try {
    const [announcements, barangayInfo] = await Promise.all([
      db.announcement.findMany({
        where: { isPublished: true },
        orderBy: [
          { isPinned: "desc" },
          { createdAt: "desc" },
        ],
        take: 3,
      }),
      db.barangayInfo.findFirst(),
    ])

    return { announcements, barangayInfo }
  } catch (error) {
    console.error("Failed to load homepage data:", error)
    return {
      announcements: [],
      barangayInfo: null,
    }
  }
}

export default async function HomePage() {
  const { announcements, barangayInfo } = await getHomePageData()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Glassmorphism */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <ShieldCheck className="h-6 w-6 text-white" />
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
            <Link href="/marketplace" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
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
            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 -z-10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Star className="h-4 w-4" />
                Trusted by 500+ Barangays
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Gateway to a{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smarter Barangay
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Connect with your community, access essential services, and discover a vibrant 
                local marketplace. Experience transparent, efficient, and caring governance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8" asChild>
                  <Link href="/portal">
                    Explore Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 border-2" asChild>
                  <Link href="/marketplace">
                    <Store className="mr-2 h-5 w-5" />
                    Visit Marketplace
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-500">Residents</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-500">Barangays</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-500">Transactions</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image/Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-1 shadow-2xl">
                <div className="bg-white rounded-3xl p-8">
                  <div className="space-y-6">
                    {/* Mockup Cards */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Barangay Clearance</div>
                        <div className="text-sm text-gray-500">Approved • 2 hours ago</div>
                      </div>
                      <div className="ml-auto">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Ready
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Store className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Marketplace</div>
                        <div className="text-sm text-gray-500">3 new items near you</div>
                      </div>
                      <div className="ml-auto">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          New
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <Bell className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Community Alert</div>
                        <div className="text-sm text-gray-500">Barangay Assembly on Friday</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg p-4 animate-fade-in">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  <span className="text-sm font-medium">Community First</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access essential barangay services, connect with your community, 
              and manage your transactions all in one place.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Resident Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Register as a resident, update your information, and access 
                  barangay programs and benefits seamlessly.
                </p>
                <Link href="/residents" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            {/* Service 2 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-7 w-7 text-green-600" />
                </div>
                <CardTitle className="text-xl">Documents & Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Request barangay clearances, certificates, and other documents 
                  online with fast and convenient processing.
                </p>
                <Link href="/clearances" className="inline-flex items-center text-green-600 font-medium hover:text-green-700">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            {/* Service 3 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="h-7 w-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Local Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Buy, sell, or trade goods and services within your community. 
                  Support local businesses and neighbors.
                </p>
                <Link href="/marketplace" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700">
                  Explore <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            {/* Service 4 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 bg-red-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-7 w-7 text-red-600" />
                </div>
                <CardTitle className="text-xl">Incident Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Report incidents, file complaints, and track the status of 
                  your cases securely and confidentially.
                </p>
                <Link href="/incidents" className="inline-flex items-center text-red-600 font-medium hover:text-red-700">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            {/* Service 5 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-7 w-7 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Community Forum</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Engage with fellow residents, share ideas, and participate 
                  in discussions that matter to your community.
                </p>
                <Link href="/forum" className="inline-flex items-center text-amber-600 font-medium hover:text-amber-700">
                  Join discussion <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>

            {/* Service 6 */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-7 w-7 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Transparency Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Access public records, view financial reports, and stay 
                  informed about barangay projects and initiatives.
                </p>
                <Link href="/transparency" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700">
                  View reports <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Marketplace Highlight Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
                  <Store className="h-4 w-4" />
                  Community Marketplace
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Buy, Sell & Trade with Your Neighbors
                </h2>
                <p className="text-lg text-blue-100 mb-8">
                  Discover a vibrant local marketplace where residents can buy, sell, 
                  or trade goods and services. Support your neighbors and strengthen 
                  our community bonds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-8" asChild>
                    <Link href="/marketplace">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Browse Items
                    </Link>
                  </Button>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-8" asChild>
                    <Link href="/marketplace/sell">
                      Start Selling
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Link href="/marketplace/1" className="block">
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="h-32 bg-white/20 rounded-xl mb-3 flex items-center justify-center text-5xl">
                        🥬
                      </div>
                      <div className="font-medium">Fresh Vegetables Bundle</div>
                      <div className="text-sm text-blue-200">₱150 - Local Farm</div>
                    </div>
                  </Link>
                  <Link href="/marketplace/2" className="block">
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="h-24 bg-white/20 rounded-xl mb-3 flex items-center justify-center text-5xl">
                        🎋
                      </div>
                      <div className="font-medium">Handmade Bamboo Crafts</div>
                      <div className="text-sm text-blue-200">₱350 - Artisan Coop</div>
                    </div>
                  </Link>
                </div>
                <div className="space-y-4 pt-8">
                  <Link href="/marketplace/4" className="block">
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="h-24 bg-white/20 rounded-xl mb-3 flex items-center justify-center text-5xl">
                        🍞
                      </div>
                      <div className="font-medium">Homemade Banana Bread</div>
                      <div className="text-sm text-blue-200">₱120 - Home Baker</div>
                    </div>
                  </Link>
                  <Link href="/marketplace/7" className="block">
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-4 hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="h-32 bg-white/20 rounded-xl mb-3 flex items-center justify-center text-5xl">
                        👕
                      </div>
                      <div className="font-medium">Vintage T-Shirt</div>
                      <div className="text-sm text-blue-200">₱200 - Thrift Shop</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Latest News & Updates
              </h2>
              <p className="text-gray-600">
                Stay informed with the latest announcements from your barangay.
              </p>
            </div>
            <Button variant="outline" className="hidden sm:flex" asChild>
              <Link href="/announcements">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.length === 0 ? (
              <>
                {/* Default announcements when none exist */}
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        EVENT
                      </span>
                      <span className="text-xs text-gray-500">Jan 15, 2026</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      Barangay Assembly Meeting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      Join us for our quarterly barangay assembly meeting where we will discuss 
                      upcoming projects, budget allocations, and community concerns.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                        ADVISORY
                      </span>
                      <span className="text-xs text-gray-500">Jan 10, 2026</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      Free Medical Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      Free medical check-ups, dental services, and medicine distribution 
                      for all residents. Bring your barangay ID for registration.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        NEWS
                      </span>
                      <span className="text-xs text-gray-500">Jan 5, 2026</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      New Digital Services Launch
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      We're excited to announce the launch of our new digital platform 
                      for easier access to barangay services and information.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              announcements.map((announcement) => (
                <Card key={announcement.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`
                        px-3 py-1 text-xs font-medium rounded-full
                        ${announcement.announcementType === "EVENT" 
                          ? "bg-blue-100 text-blue-700" 
                          : announcement.announcementType === "ADVISORY"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }
                      `}>
                        {announcement.announcementType}
                      </span>
                      {announcement.isPinned && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          Pinned
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {announcement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-4">
                      Posted on {formatDate(announcement.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/announcements">
                View All Announcements
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of residents already using BarangayMo to access services, 
            connect with the community, and stay informed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8" asChild>
              <Link href="/register">
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8" asChild>
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">BarangayMo</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Modern Barangay Management System empowering communities with 
                transparent, efficient, and accessible digital governance.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/announcements" className="hover:text-white transition-colors">News</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Staff Login</Link></li>
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/residents" className="hover:text-white transition-colors">Resident Registration</Link></li>
                <li><Link href="/clearances" className="hover:text-white transition-colors">Barangay Clearance</Link></li>
                <li><Link href="/incidents" className="hover:text-white transition-colors">Incident Reporting</Link></li>
                <li><Link href="/forum" className="hover:text-white transition-colors">Community Forum</Link></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-white mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{barangayInfo?.address || "Barangay Hall, Philippines"}</span>
                </li>
                <li>{barangayInfo?.contactNumber || "+63 (2) 8123 4567"}</li>
                <li>{barangayInfo?.email || "info@barangaymo.com.ph"}</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-500">Office Hours</p>
                <p className="text-sm">Monday - Friday: 8:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2026 BarangayMo. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
