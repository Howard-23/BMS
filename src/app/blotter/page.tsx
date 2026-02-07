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

interface BlotterPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlotterPage({ searchParams }: BlotterPageProps) {
  const params = await searchParams
  const status = typeof params.status === 'string' ? params.status : ''

  const where: any = {}
  if (status) {
    where.status = status
  }

  const blotters = await db.blotter.findMany({
    where,
    orderBy: { entryDate: "desc" },
    take: 50,
    include: {
      resident: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "default"
      case "ACTIVE":
        return "secondary"
      case "PENDING":
        return "warning"
      case "CLOSED":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blotter Records</h1>
          <p className="text-muted-foreground">Manage barangay blotter entries</p>
        </div>
        <Button asChild>
          <Link href="/blotter/new">
            <Plus className="mr-2 h-4 w-4" />
            New Entry
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
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
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
                  <TableHead>Blotter No.</TableHead>
                  <TableHead>Complainant</TableHead>
                  <TableHead>Respondent</TableHead>
                  <TableHead>Nature of Complaint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Entry Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blotters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No blotter entries found
                    </TableCell>
                  </TableRow>
                ) : (
                  blotters.map((blotter) => (
                    <TableRow key={blotter.id}>
                      <TableCell className="font-medium">
                        {blotter.blotterNo}
                      </TableCell>
                      <TableCell>{blotter.complainant}</TableCell>
                      <TableCell>{blotter.respondent || "N/A"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {blotter.natureOfComplaint}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(blotter.status)}>
                          {blotter.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(blotter.entryDate)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blotter/${blotter.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
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
