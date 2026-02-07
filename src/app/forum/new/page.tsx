"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function NewTopicPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      // In a real implementation, you would save to the database
      // For now, just show success and redirect
      toast.success("Topic posted successfully!")
      router.push("/forum")
    } catch (error) {
      toast.error("Failed to post topic")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/forum">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Discussion Topic</h1>
          <p className="text-muted-foreground">Start a new conversation with the community</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Topic Title *</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="Enter a clear and concise title"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                className="w-full px-3 py-2 rounded-md border bg-background"
              >
                <option value="general">General Discussion</option>
                <option value="announcement">Barangay Announcement</option>
                <option value="suggestion">Suggestion</option>
                <option value="concern">Concern/Issue</option>
                <option value="event">Event Planning</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea 
                id="content" 
                name="content" 
                rows={10}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                required 
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Posting..." : "Post Topic"}
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href="/forum">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
