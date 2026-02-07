export const dynamic = 'force-dynamic'

import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface IncidentsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function IncidentsPage({ searchParams }: IncidentsPageProps) {
  const params = await searchParams
  const status = typeof params.status === 'string' ? params.status : ''

  const where: any = {}
  if (status) {
    where.status = status
  }

  const incidents = await db.incidentReport.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "default"
      case "PENDING":
        return "secondary"
      case "UNDER_INVESTIGATION":
        return "warning"
      case "DISMISSED":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Incident Reports</h1>
          <p className="text-muted-foreground">Manage incident and blotter reports</p>
        </div>
        <Button asChild>
          <Link href="/incidents/new">
            <Plus className="mr-2 h-4 w-4" />
            Report Incident
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <form className="flex gap-2">
            <select
              name="status"
              defaultValue={status}
              className="px-3 py-2 rounded-md border bg-background"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
            <Button type="submit" variant="secondary">
              Filter
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case No.</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Complainant</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No incidents found
                    </TableCell>
                  </TableRow>
                ) : (
                  incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">
                        {incident.caseNo}
                      </TableCell>
                      <TableCell>{incident.incidentType}</TableCell>
                      <TableCell>{incident.complainantName}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {incident.incidentLocation}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(incident.status)}>
                          {incident.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(incident.incidentDate)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
