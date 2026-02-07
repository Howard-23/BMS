import Link from "next/link"
import { ShieldCheck, Users, FileText, AlertTriangle, BookOpen, Wallet, Megaphone, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const services = [
  {
    title: "Resident Registration",
    description: "Register as a barangay resident and get your official barangay ID.",
    icon: Users,
    href: "/residents",
    color: "bg-blue-500",
    features: ["Online registration", "Barangay ID issuance", "Profile management"],
  },
  {
    title: "Barangay Clearance",
    description: "Request barangay clearances and certificates for various purposes.",
    icon: FileText,
    href: "/clearances",
    color: "bg-green-500",
    features: ["Online application", "Fast processing", "Digital certificates"],
  },
  {
    title: "Incident Reporting",
    description: "Report incidents, file complaints, and track case status.",
    icon: AlertTriangle,
    href: "/incidents",
    color: "bg-red-500",
    features: ["Online reporting", "Case tracking", "Confidential"],
  },
  {
    title: "Blotter Services",
    description: "File blotter reports and request copies of blotter records.",
    icon: BookOpen,
    href: "/blotter",
    color: "bg-amber-500",
    features: ["Online filing", "Record requests", "24/7 availability"],
  },
  {
    title: "Financial Services",
    description: "View financial reports, request documents, and make payments.",
    icon: Wallet,
    href: "/financial",
    color: "bg-purple-500",
    features: ["Transparency portal", "Online payments", "Receipt tracking"],
  },
  {
    title: "Announcements",
    description: "Stay updated with the latest news and announcements.",
    icon: Megaphone,
    href: "/announcements",
    color: "bg-cyan-500",
    features: ["Latest news", "Event updates", "Emergency alerts"],
  },
]

export default function ServicesPage() {
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
            <Link href="/services" className="text-sm font-medium text-blue-600">
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
            Our Services
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            We offer a wide range of services to help our community. Access them online or visit our barangay hall.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`${service.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={service.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact us directly and we'll be happy to assist you.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
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
