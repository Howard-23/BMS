import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { signUpWithSupabase } from "@/lib/supabase-auth"

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

function isDatabaseWriteError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase()

  return (
    message.includes("readonly") ||
    message.includes("unable to open database file") ||
    message.includes("attempt to write a readonly database") ||
    message.includes("environment variable not found: database_url") ||
    message.includes("can't reach database server")
  )
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

    let existingUsername = null
    let existingEmail = null

    try {
      ;[existingUsername, existingEmail] = await Promise.all([
        db.user.findUnique({ where: { username } }),
        db.user.findUnique({ where: { email } }),
      ])
    } catch (error) {
      console.error("Failed to validate local user uniqueness:", error)
    }

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

    let supabaseResult

    try {
      supabaseResult = await signUpWithSupabase(email, password, {
        username,
        firstName,
        lastName,
        role: "STAFF",
      })
    } catch (error) {
      console.error("Supabase signup failed:", error)
      return NextResponse.json(
        {
          error:
            "Supabase is not configured on Vercel. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your project environment variables.",
        },
        { status: 500 }
      )
    }

    if (supabaseResult.error) {
      return NextResponse.json(
        { error: supabaseResult.error },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)
    let warning: string | undefined

    try {
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
    } catch (error) {
      console.error("Local user profile creation failed:", error)

      if (isDatabaseWriteError(error)) {
        warning =
          "Your Supabase account was created, but the app database is not configured for writes on Vercel. Add a hosted DATABASE_URL if you want username-based login and local user records."
      } else {
        return NextResponse.json(
          { error: "Account created in Supabase, but local profile creation failed." },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      requiresEmailConfirmation: !supabaseResult.data?.session,
      warning,
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json(
      { error: "Failed to create your account." },
      { status: 500 }
    )
  }
}
