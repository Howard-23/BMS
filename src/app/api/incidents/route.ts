import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Generate case number
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
    const count = await db.incidentReport.count({
      where: {
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        },
      },
    })
    const caseNo = `CASE-${dateStr}-${(count + 1).toString().padStart(4, '0')}`

    const incident = await db.incidentReport.create({
      data: {
        caseNo,
        incidentType: data.incidentType,
        incidentDate: new Date(data.incidentDate),
        incidentLocation: data.incidentLocation,
        description: data.description,
        complainantName: data.complainantName,
        complainantAddress: data.complainantAddress || null,
        complainantContact: data.complainantContact || null,
        respondentName: data.respondentName || null,
        respondentAddress: data.respondentAddress || null,
        respondentContact: data.respondentContact || null,
        status: "PENDING",
      },
    })

    return NextResponse.json(incident)
  } catch (error) {
    console.error("Error creating incident:", error)
    return NextResponse.json(
      { error: "Failed to create incident report" },
      { status: 500 }
    )
  }
}
