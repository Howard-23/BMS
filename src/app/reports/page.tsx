export const dynamic = 'force-dynamic'

import Link from "next/link"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  Wallet,
  BarChart3,
  PieChart,
  TrendingUp
} from "lucide-react"

export default async function ReportsPage() {
  const [
    totalResidents,
    maleCount,
    femaleCount,
    votersCount,
    seniorsCount,
    pwdCount,
    clearancesCount,
    incidentsCount,
  ] = await Promise.all([
    db.resident.count({ where: { status: "active" } }),
    db.resident.count({ where: { gender: "MALE", status: "active" } }),
    db.resident.count({ where: { gender: "FEMALE", status: "active" } }),
    db.resident.count({ where: { isVoter: true, status: "active" } }),
    db.resident.count({ where: { isSeniorCitizen: true, status: "active" } }),
    db.resident.count({ where: { isPwd: true, status: "active" } }),
    db.barangayClearance.count(),
    db.incidentReport.count(),
  ])

  const reportCards = [
    {
      title: "Resident Statistics",
      description: "Demographics, age groups, and classifications",
      icon: Users,
      href: "/reports/residents",
      stats: `${totalResidents} total residents`,
    },
    {
      title: "Clearance Reports",
      description: "Clearance issuance and revenue summary",
      icon: FileText,
      href: "/reports/clearances",
      stats: `${clearancesCount} clearances issued`,
    },
    {
      title: "Incident Reports",
      description: "Incident trends and resolution status",
      icon: AlertTriangle,
      href: "/reports/incidents",
      stats: `${incidentsCount} incidents reported`,
    },
    {
      title: "Financial Reports",
      description: "Income, expenses, and budget analysis",
      icon: Wallet,
      href: "/reports/financial",
      stats: "Monthly financial summary",
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">View and generate barangay reports</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reportCards.map((card) => (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{card.stats}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{card.description}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href={card.href}>View Report</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <PieChart className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{maleCount}</p>
              <p className="text-sm text-muted-foreground">Male Residents</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <PieChart className="h-8 w-8 text-pink-500" />
              </div>
              <p className="text-2xl font-bold">{femaleCount}</p>
              <p className="text-sm text-muted-foreground">Female Residents</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{votersCount}</p>
              <p className="text-sm text-muted-foreground">Registered Voters</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-2xl font-bold">{seniorsCount}</p>
              <p className="text-sm text-muted-foreground">Senior Citizens</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
