export const dynamic = 'force-dynamic'

import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pin } from "lucide-react"
import { formatDate } from "@/lib/utils"

async function getAnnouncements() {
  try {
    return await db.announcement.findMany({
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
      take: 50,
    })
  } catch (error) {
    console.error("Failed to load announcements:", error)
    return []
  }
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements()

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EVENT":
        return "bg-blue-500"
      case "ADVISORY":
        return "bg-amber-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Manage barangay announcements and news</p>
        </div>
        <Button asChild>
          <Link href="/announcements/new">
            <Plus className="mr-2 h-4 w-4" />
            New Announcement
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {announcements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No announcements yet</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((announcement) => (
            <Card key={announcement.id} className={announcement.isPinned ? "border-primary" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(announcement.announcementType)}>
                      {announcement.announcementType}
                    </Badge>
                    {announcement.isPinned && (
                      <Badge variant="outline" className="text-red-500 border-red-500">
                        <Pin className="h-3 w-3 mr-1" />
                        Pinned
                      </Badge>
                    )}
                    {!announcement.isPublished && (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(announcement.createdAt)}
                  </span>
                </div>
                <CardTitle className="text-xl mt-2">{announcement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {announcement.content}
                </p>
                {announcement.eventDate && (
                  <p className="text-sm text-blue-600 mt-2">
                    Event Date: {formatDate(announcement.eventDate)}
                    {announcement.eventLocation && ` at ${announcement.eventLocation}`}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
