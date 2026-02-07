export const dynamic = 'force-dynamic'

import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus, Search, Eye } from "lucide-react"

interface ResidentsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ResidentsPage({ searchParams }: ResidentsPageProps) {
  const params = await searchParams
  const search = typeof params.search === 'string' ? params.search : ''
  const purok = typeof params.purok === 'string' ? params.purok : ''

  const where: any = { status: "active" }
  
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { barangayId: { contains: search, mode: "insensitive" } },
    ]
  }
  
  if (purok) {
    where.purok = purok
  }

  const residents = await db.resident.findMany({
    where,
    orderBy: { lastName: "asc" },
    take: 50,
  })

  const puroks = await db.resident.groupBy({
    by: ["purok"],
    where: { status: "active", purok: { not: null } },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Residents</h1>
          <p className="text-muted-foreground">Manage resident records</p>
        </div>
        <Button asChild>
          <Link href="/residents/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Resident
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <form className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search by name or ID..."
                  defaultValue={search}
                  className="pl-10"
                />
              </div>
              <select
                name="purok"
                defaultValue={purok}
                className="px-3 py-2 rounded-md border bg-background"
              >
                <option value="">All Puroks</option>
                {puroks.map((p) => (
                  p.purok && <option key={p.purok} value={p.purok}>{p.purok}</option>
                ))}
              </select>
              <Button type="submit" variant="secondary">
                Filter
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Barangay ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Purok</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {residents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No residents found
                    </TableCell>
                  </TableRow>
                ) : (
                  residents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell className="font-medium">
                        {resident.barangayId || "N/A"}
                      </TableCell>
                      <TableCell>
                        {resident.lastName}, {resident.firstName} {resident.middleName}
                      </TableCell>
                      <TableCell>
                        {new Date().getFullYear() - new Date(resident.birthDate).getFullYear()}
                      </TableCell>
                      <TableCell>{resident.purok || "N/A"}</TableCell>
                      <TableCell>{resident.phone || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {resident.isVoter && (
                            <Badge variant="secondary" className="text-xs">Voter</Badge>
                          )}
                          {resident.isSeniorCitizen && (
                            <Badge variant="default" className="text-xs bg-amber-500">Senior</Badge>
                          )}
                          {resident.isPwd && (
                            <Badge variant="default" className="text-xs bg-blue-500">PWD</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/residents/${resident.id}`}>
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
