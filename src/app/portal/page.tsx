import Link from "next/link"
import { ShieldCheck, Users, FileText, Store, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const portalServices = [
  {
    title: "Resident Services",
    description: "Register as a resident, update your information, and access barangay programs.",
    icon: Users,
    href: "/residents",
    color: "bg-blue-500",
  },
  {
    title: "Request Documents",
    description: "Request barangay clearances, certificates, and other documents online.",
    icon: FileText,
    href: "/clearances",
    color: "bg-green-500",
  },
  {
    title: "Marketplace",
    description: "Buy, sell, or trade goods and services within your community.",
    icon: Store,
    href: "/marketplace",
    color: "bg-purple-500",
  },
]

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
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
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Barangay Services Portal
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Access essential barangay services online. Convenient, fast, and hassle-free.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {portalServices.map((service) => (
              <Card key={service.title} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`${service.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={service.href}>
                      Access Service
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Our staff are ready to assist you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/login">Staff Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm text-gray-500">
            © 2026 BarangayMo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
