"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, FileText, Printer } from "lucide-react"
import { formatDate, calculateAge, formatCurrency } from "@/lib/utils"
import type { Resident, BarangayClearance } from "@/types"

export default function ResidentViewPage() {
  const params = useParams()
  const [resident, setResident] = useState<Resident & { clearances: BarangayClearance[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResident() {
      try {
        const response = await fetch(`/api/residents/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setResident(data)
        }
      } catch (error) {
        console.error("Error fetching resident:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResident()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!resident) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-muted-foreground">Resident not found</h1>
        <Button asChild className="mt-4">
          <Link href="/residents">Back to Residents</Link>
        </Button>
      </div>
    )
  }

  const age = calculateAge(resident.birthDate)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/residents">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {resident.lastName}, {resident.firstName} {resident.middleName}
            </h1>
            <p className="text-muted-foreground">{resident.barangayId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/clearances/new?residentId=${resident.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              Issue Clearance
            </Link>
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {resident.isVoter && <Badge>Voter</Badge>}
        {resident.isSeniorCitizen && <Badge className="bg-amber-500">Senior Citizen</Badge>}
        {resident.isPwd && <Badge className="bg-blue-500">PWD</Badge>}
        {resident.isSoloParent && <Badge className="bg-pink-500">Solo Parent</Badge>}
        {resident.isIndigent && <Badge className="bg-red-500">Indigent</Badge>}
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="contact">Contact & IDs</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="clearances">Clearances</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Full Name</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {resident.lastName}, {resident.firstName} {resident.middleName} {resident.suffix}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Birth Date</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{formatDate(resident.birthDate)}</p>
                <p className="text-sm text-muted-foreground">{age} years old</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Gender</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{resident.gender}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Civil Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{resident.civilStatus}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Blood Type</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{resident.bloodType?.replace('_', ' ') || "N/A"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Birth Place</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{resident.birthPlace || "N/A"}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{resident.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purok/Zone</p>
                  <p className="font-medium">{resident.purok || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{resident.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{resident.email || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Identification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">PhilHealth ID</p>
                  <p className="font-medium">{resident.philhealthId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SSS ID</p>
                  <p className="font-medium">{resident.sssId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">TIN</p>
                  <p className="font-medium">{resident.tin || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Voter&apos;s ID</p>
                  <p className="font-medium">{resident.votersId || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Precinct Number</p>
                  <p className="font-medium">{resident.precinctNumber || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="family" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Family Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Father&apos;s Name</p>
                  <p className="font-medium">{resident.fatherName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mother&apos;s Name</p>
                  <p className="font-medium">{resident.motherName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Spouse&apos;s Name</p>
                  <p className="font-medium">{resident.spouseName || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{resident.emergencyContactName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{resident.emergencyContactPhone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Relationship</p>
                  <p className="font-medium">{resident.emergencyContactRelationship || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clearances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clearance History</CardTitle>
            </CardHeader>
            <CardContent>
              {resident.clearances && resident.clearances.length > 0 ? (
                <div className="space-y-4">
                  {resident.clearances.map((clearance: BarangayClearance) => (
                    <div key={clearance.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{clearance.clearanceNo}</p>
                        <p className="text-sm text-muted-foreground">{clearance.purpose}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(clearance.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-medium">{formatCurrency(Number(clearance.amount))}</p>
                        <Badge variant={clearance.status === "RELEASED" ? "default" : "secondary"}>
                          {clearance.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No clearances issued yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
