"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function NewAnnouncementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          content: formData.get("content"),
          announcementType: formData.get("announcementType"),
          eventDate: formData.get("eventDate") || null,
          eventLocation: formData.get("eventLocation") || null,
          isPinned: formData.get("isPinned") === "on",
          isPublished: formData.get("isPublished") === "on",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create announcement")
      }

      toast.success("Announcement created successfully!")
      router.push("/announcements")
    } catch (error) {
      toast.error("Failed to create announcement")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/announcements">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Announcement</h1>
          <p className="text-muted-foreground">Create a new barangay announcement</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea id="content" name="content" rows={10} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="announcementType">Type</Label>
              <select
                id="announcementType"
                name="announcementType"
                className="w-full px-3 py-2 rounded-md border bg-background"
              >
                <option value="NEWS">News</option>
                <option value="EVENT">Event</option>
                <option value="ADVISORY">Advisory</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date (for events)</Label>
                <Input id="eventDate" name="eventDate" type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventLocation">Event Location</Label>
                <Input id="eventLocation" name="eventLocation" />
              </div>
            </div>

            <div className="flex gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="isPinned" name="isPinned" />
                <Label htmlFor="isPinned" className="font-normal">
                  Pin this announcement
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isPublished" name="isPublished" defaultChecked />
                <Label htmlFor="isPublished" className="font-normal">
                  Publish immediately
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Creating..." : "Create Announcement"}
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href="/announcements">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
