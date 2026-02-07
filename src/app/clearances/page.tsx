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
import { formatDate, formatCurrency } from "@/lib/utils"

interface ClearancesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ClearancesPage({ searchParams }: ClearancesPageProps) {
  const params = await searchParams
  const status = typeof params.status === 'string' ? params.status : ''

  const where: any = {}
  if (status) {
    where.status = status
  }

  const clearances = await db.barangayClearance.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      resident: true,
    },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Barangay Clearances</h1>
          <p className="text-muted-foreground">Manage barangay clearance requests</p>
        </div>
        <Button asChild>
          <Link href="/clearances/new">
            <Plus className="mr-2 h-4 w-4" />
            Issue Clearance
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
              <option value="APPROVED">Approved</option>
              <option value="RELEASED">Released</option>
              <option value="CANCELLED">Cancelled</option>
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
                  <TableHead>Clearance No.</TableHead>
                  <TableHead>Resident</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clearances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No clearances found
                    </TableCell>
                  </TableRow>
                ) : (
                  clearances.map((clearance) => (
                    <TableRow key={clearance.id}>
                      <TableCell className="font-medium">
                        {clearance.clearanceNo}
                      </TableCell>
                      <TableCell>
                        {clearance.resident.firstName} {clearance.resident.lastName}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {clearance.purpose}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(Number(clearance.amount))}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            clearance.status === "RELEASED" 
                              ? "default" 
                              : clearance.status === "PENDING" 
                                ? "secondary" 
                                : "outline"
                          }
                        >
                          {clearance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(clearance.createdAt)}</TableCell>
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
