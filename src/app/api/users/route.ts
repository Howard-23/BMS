import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Check if username already exists
    const existingUsername = await db.user.findUnique({
      where: { username: data.username },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email: data.email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10)

    const user = await db.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName || null,
        role: data.role || "STAFF",
        position: data.position || null,
        phone: data.phone || null,
        address: data.address || null,
        isActive: true,
      },
    })

    return NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    const users = await db.user.findMany({
      where: query
        ? {
            OR: [
              { firstName: { contains: query } },
              { lastName: { contains: query } },
              { username: { contains: query } },
              { email: { contains: query } },
            ],
          }
        : undefined,
      take: 10,
      orderBy: { lastName: "asc" },
    })

    return NextResponse.json(
      users.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        name: `${u.firstName} ${u.lastName}`,
        role: u.role,
        position: u.position,
      }))
    )
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
