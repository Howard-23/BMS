export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Home, 
  Vote, 
  Heart, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Megaphone,
  ArrowRight
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

async function getDashboardStats() {
  const [
    totalResidents,
    totalHouseholds,
    totalVoters,
    seniorCitizens,
    pendingClearances,
    pendingIncidents,
  ] = await Promise.all([
    db.resident.count({ where: { status: "active" } }),
    db.resident.groupBy({ by: ["address"] }).then(r => r.length),
    db.resident.count({ where: { isVoter: true, status: "active" } }),
    db.resident.count({ where: { isSeniorCitizen: true, status: "active" } }),
    db.barangayClearance.count({ where: { status: "PENDING" } }),
    db.incidentReport.count({ where: { status: "PENDING" } }),
  ])

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const monthlyIncome = await db.financialTransaction.aggregate({
    _sum: { amount: true },
    where: {
      transactionType: "INCOME",
      transactionDate: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  })

  const monthlyExpense = await db.financialTransaction.aggregate({
    _sum: { amount: true },
    where: {
      transactionType: "EXPENSE",
      transactionDate: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  })

  const recentClearances = await db.barangayClearance.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { resident: true },
  })

  const recentIncidents = await db.incidentReport.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  })

  const recentAnnouncements = await db.announcement.findMany({
    where: { isPublished: true },
    take: 3,
    orderBy: [
      { isPinned: "desc" },
      { createdAt: "desc" },
    ],
  })

  return {
    totalResidents,
    totalHouseholds,
    totalVoters,
    seniorCitizens,
    pendingClearances,
    pendingIncidents,
    monthlyIncome: monthlyIncome._sum.amount || 0,
    monthlyExpense: monthlyExpense._sum.amount || 0,
    recentClearances,
    recentIncidents,
    recentAnnouncements,
  }
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const stats = await getDashboardStats()

  const statCards = [
    {
      title: "Total Residents",
      value: stats.totalResidents,
      icon: Users,
      color: "bg-blue-500",
      href: "/residents",
    },
    {
      title: "Households",
      value: stats.totalHouseholds,
      icon: Home,
      color: "bg-green-500",
      href: "/residents",
    },
    {
      title: "Registered Voters",
      value: stats.totalVoters,
      icon: Vote,
      color: "bg-amber-500",
      href: "/residents",
    },
    {
      title: "Senior Citizens",
      value: stats.seniorCitizens,
      icon: Heart,
      color: "bg-cyan-500",
      href: "/residents",
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="rounded-2xl bg-gradient-to-br from-sky-300 to-blue-400 p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-wide">
          WELCOME TO BARANGAYMO PORTAL
        </h1>
        <p className="text-slate-800 max-w-xl mx-auto mb-8">
          Select the button to explore services and resources tailored for you.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-red-700 hover:bg-red-800 text-white px-8 py-6 text-lg"
            asChild
          >
            <Link href="/residents">Manage Residents</Link>
          </Button>
          <Button 
            size="lg" 
            className="bg-red-700 hover:bg-red-800 text-white px-8 py-6 text-lg"
            asChild
          >
            <Link href="/clearances">Issue Clearances</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Link 
                href={stat.href}
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Clearances */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Recent Clearances</CardTitle>
            </div>
            <Badge variant="secondary">{stats.pendingClearances} pending</Badge>
          </CardHeader>
          <CardContent>
            {stats.recentClearances.length > 0 ? (
              <div className="space-y-3">
                {stats.recentClearances.map((clearance) => (
                  <div 
                    key={clearance.id} 
                    className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{clearance.clearanceNo}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {clearance.resident.firstName} {clearance.resident.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{clearance.purpose}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDate(clearance.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No clearances yet</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/clearances">View All Clearances</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg">Recent Incidents</CardTitle>
            </div>
            <Badge variant="destructive">{stats.pendingIncidents} pending</Badge>
          </CardHeader>
          <CardContent>
            {stats.recentIncidents.length > 0 ? (
              <div className="space-y-3">
                {stats.recentIncidents.map((incident) => (
                  <div 
                    key={incident.id} 
                    className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{incident.caseNo}</p>
                        <Badge 
                          variant={incident.status === "RESOLVED" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.incidentType}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {incident.incidentLocation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No incidents reported</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/incidents">View All Incidents</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">This Month&apos;s Finances</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-green-50">
                <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(Number(stats.monthlyIncome))}
                </p>
                <p className="text-xs text-muted-foreground">Income</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-red-50">
                <TrendingDown className="h-5 w-5 text-red-600 mx-auto mb-1" />
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(Number(stats.monthlyExpense))}
                </p>
                <p className="text-xs text-muted-foreground">Expenses</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-muted flex items-center justify-between">
              <span className="text-sm font-medium">Net Balance</span>
              <span className={`text-lg font-bold ${
                Number(stats.monthlyIncome) >= Number(stats.monthlyExpense) 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {formatCurrency(Number(stats.monthlyIncome) - Number(stats.monthlyExpense))}
              </span>
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/financial">View Financial Reports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Announcements */}
      {stats.recentAnnouncements.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">Recent Announcements</CardTitle>
            </div>
            <Button size="sm" asChild>
              <Link href="/announcements">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {stats.recentAnnouncements.map((announcement) => (
                <div 
                  key={announcement.id} 
                  className="p-4 rounded-lg border relative"
                >
                  {announcement.isPinned && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      Pinned
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground mb-2">
                    {formatDate(announcement.createdAt)}
                  </p>
                  <h3 className="font-semibold mb-2">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {announcement.content}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/residents/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Resident
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/clearances/new">
                <Plus className="mr-2 h-4 w-4" />
                Issue Clearance
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/incidents/new">
                <Plus className="mr-2 h-4 w-4" />
                Report Incident
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/announcements/new">
                <Plus className="mr-2 h-4 w-4" />
                Post Announcement
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
