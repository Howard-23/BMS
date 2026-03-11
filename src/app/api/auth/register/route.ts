import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { signUpWithSupabase } from "@/lib/supabase-auth"

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const firstName = cleanValue(body.firstName)
    const lastName = cleanValue(body.lastName)
    const email = cleanValue(body.email).toLowerCase()
    const username = cleanValue(body.username)
    const password = typeof body.password === "string" ? body.password : ""

    if (!firstName || !lastName || !email || !username || !password) {
      return NextResponse.json(
        { error: "All required fields must be provided." },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      )
    }

    const [existingUsername, existingEmail] = await Promise.all([
      db.user.findUnique({ where: { username } }),
      db.user.findUnique({ where: { email } }),
    ])

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken." },
        { status: 400 }
      )
    }

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 400 }
      )
    }

    const supabaseResult = await signUpWithSupabase(email, password, {
      username,
      firstName,
      lastName,
      role: "STAFF",
    })

    if (supabaseResult.error) {
      return NextResponse.json(
        { error: supabaseResult.error },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await db.user.create({
      data: {
        username,
        email,
        passwordHash,
        firstName,
        lastName,
        role: "STAFF",
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      requiresEmailConfirmation: !supabaseResult.data?.session,
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json(
      { error: "Failed to create your account." },
      { status: 500 }
    )
  }
}
