import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const resident = await db.resident.create({
      data: {
        firstName: data.firstName,
        middleName: data.middleName || null,
        lastName: data.lastName,
        suffix: data.suffix || null,
        birthDate: new Date(data.birthDate),
        birthPlace: data.birthPlace || null,
        gender: data.gender,
        civilStatus: data.civilStatus || "SINGLE",
        bloodType: data.bloodType || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address,
        purok: data.purok || null,
        philhealthId: data.philhealthId || null,
        sssId: data.sssId || null,
        gsisId: data.gsisId || null,
        tin: data.tin || null,
        votersId: data.votersId || null,
        isVoter: data.isVoter || false,
        precinctNumber: data.precinctNumber || null,
        occupation: data.occupation || null,
        employmentStatus: data.employmentStatus || null,
        monthlyIncome: data.monthlyIncome || null,
        educationalAttainment: data.educationalAttainment || null,
        schoolLastAttended: data.schoolLastAttended || null,
        motherName: data.motherName || null,
        fatherName: data.fatherName || null,
        spouseName: data.spouseName || null,
        isSeniorCitizen: data.isSeniorCitizen || false,
        isPwd: data.isPwd || false,
        isSoloParent: data.isSoloParent || false,
        isIndigent: data.isIndigent || false,
        emergencyContactName: data.emergencyContactName || null,
        emergencyContactPhone: data.emergencyContactPhone || null,
        emergencyContactRelationship: data.emergencyContactRelationship || null,
        remarks: data.remarks || null,
        status: "active",
      },
    })

    // Generate Barangay ID
    const barangayId = `BID-${resident.id.toString().padStart(6, "0")}`
    const updatedResident = await db.resident.update({
      where: { id: resident.id },
      data: { barangayId },
    })

    return NextResponse.json(updatedResident)
  } catch (error) {
    console.error("Error creating resident:", error)
    return NextResponse.json(
      { error: "Failed to create resident" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    const residents = await db.resident.findMany({
      where: query
        ? {
            status: "active",
            OR: [
              { firstName: { contains: query, mode: "insensitive" } },
              { lastName: { contains: query, mode: "insensitive" } },
              { barangayId: { contains: query, mode: "insensitive" } },
            ],
          }
        : { status: "active" },
      take: 10,
      orderBy: { lastName: "asc" },
    })

    return NextResponse.json(
      residents.map((r) => ({
        id: r.id,
        barangayId: r.barangayId,
        name: `${r.firstName} ${r.lastName}`,
        address: r.address,
        purok: r.purok,
      }))
    )
  } catch (error) {
    console.error("Error fetching residents:", error)
    return NextResponse.json(
      { error: "Failed to fetch residents" },
      { status: 500 }
    )
  }
}
