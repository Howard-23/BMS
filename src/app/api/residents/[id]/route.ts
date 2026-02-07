import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const resident = await db.resident.findUnique({
      where: { id: parseInt(id) },
      include: {
        clearances: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!resident) {
      return NextResponse.json(
        { error: "Resident not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(resident)
  } catch (error) {
    console.error("Error fetching resident:", error)
    return NextResponse.json(
      { error: "Failed to fetch resident" },
      { status: 500 }
    )
  }
}
