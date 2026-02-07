export const dynamic = 'force-dynamic'

import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MapPin, Shield, User } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface UserPageProps {
  params: Promise<{ id: string }>
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params
  
  const user = await db.user.findUnique({
    where: { id: parseInt(id) },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/users">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="text-muted-foreground">View and manage user information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xl font-bold text-primary">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.firstName} {user.middleName} {user.lastName}
                </h2>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                {user.role}
              </Badge>
              <Badge variant={user.isActive ? "default" : "destructive"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{user.address || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>{user.position || "No position"}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Account Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>{" "}
                {formatDate(user.createdAt)}
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>{" "}
                {formatDate(user.updatedAt)}
              </div>
              <div>
                <span className="text-muted-foreground">Last Login:</span>{" "}
                {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button asChild>
              <Link href={`/users/${user.id}/edit`}>Edit User</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/users">Back to Users</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
