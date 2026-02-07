import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Generate clearance number
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
    const count = await db.barangayClearance.count({
      where: {
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        },
      },
    })
    const clearanceNo = `BC-${dateStr}-${(count + 1).toString().padStart(4, '0')}`

    const clearance = await db.barangayClearance.create({
      data: {
        clearanceNo,
        residentId: data.residentId,
        purpose: data.purpose,
        amount: data.amount,
        ctcNo: data.ctcNo || null,
        orNo: data.orNo || null,
        status: "APPROVED",
        processedAt: new Date(),
      },
    })

    return NextResponse.json(clearance)
  } catch (error) {
    console.error("Error creating clearance:", error)
    return NextResponse.json(
      { error: "Failed to create clearance" },
      { status: 500 }
    )
  }
}
