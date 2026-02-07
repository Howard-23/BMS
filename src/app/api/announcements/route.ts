import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const announcement = await db.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        announcementType: data.announcementType,
        eventDate: data.eventDate ? new Date(data.eventDate) : null,
        eventLocation: data.eventLocation || null,
        isPinned: data.isPinned,
        isPublished: data.isPublished,
      },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error("Error creating announcement:", error)
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    )
  }
}
