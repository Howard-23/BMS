export const dynamic = 'force-dynamic'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Plus, ThumbsUp, Eye } from "lucide-react"

export default function ForumPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">Discuss barangay matters with fellow residents</p>
        </div>
        <Button asChild>
          <Link href="/forum/new">
            <Plus className="mr-2 h-4 w-4" />
            New Topic
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {/* Sample Forum Topics */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                  Barangay Clean-up Drive Schedule
                </h3>
                <p className="text-muted-foreground mt-1">
                  Let&apos;s discuss the schedule for our upcoming clean-up drive this month...
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>Posted by Juan Dela Cruz</span>
                  <span>•</span>
                  <span>2 days ago</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    12 replies
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    156 views
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                  Road Repair on Main Street
                </h3>
                <p className="text-muted-foreground mt-1">
                  Update on the road repair project. The barangay council has approved the budget...
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>Posted by Maria Santos</span>
                  <span>•</span>
                  <span>5 days ago</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    8 replies
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    234 views
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                  Suggestions for Barangay Fiesta 2026
                </h3>
                <p className="text-muted-foreground mt-1">
                  We want to hear your ideas for this year&apos;s fiesta celebration. Share your thoughts!
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>Posted by Pedro Reyes</span>
                  <span>•</span>
                  <span>1 week ago</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    24 replies
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    512 views
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold">Join the Discussion</h3>
          <p className="text-muted-foreground mt-1">
            Share your thoughts, ask questions, and connect with your barangay community.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/forum/new">Start a New Topic</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
