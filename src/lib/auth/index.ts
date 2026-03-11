import { getServerSession } from "next-auth"
import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { signInWithSupabase } from "@/lib/supabase-auth"

function getMetadataValue(
  metadata: Record<string, unknown> | null | undefined,
  key: string
) {
  const value = metadata?.[key]
  return typeof value === "string" ? value : undefined
}

export const authOptions: NextAuthOptions = {
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const identifier = credentials.username.trim()
        const password = credentials.password
        let user = null

        try {
          user = await db.user.findFirst({
            where: {
              OR: [{ username: identifier }, { email: identifier }],
            },
          })
        } catch (error) {
          console.error("Failed to query local user during login:", error)
        }

        const supabaseEmail = user?.email ?? identifier
        let supabaseResult: Awaited<ReturnType<typeof signInWithSupabase>> | null = null

        try {
          supabaseResult = await signInWithSupabase(supabaseEmail, password)
        } catch (error) {
          console.error("Failed to authenticate with Supabase:", error)
        }

        if (supabaseResult && !supabaseResult.error && supabaseResult.data?.user) {
          if (user && !user.isActive) {
            return null
          }

          if (user) {
            try {
              await db.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() }
              })
            } catch (error) {
              console.error("Failed to update last login for local user:", error)
            }

            return {
              id: String(user.id),
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              position: user.position ?? undefined,
            }
          }

          const supabaseUser = supabaseResult.data.user
          const metadata = supabaseUser.user_metadata
          const email = supabaseUser.email ?? supabaseEmail
          const username = getMetadataValue(metadata, "username") ?? email.split("@")[0]

          return {
            id: supabaseUser.id,
            username,
            email,
            firstName: getMetadataValue(metadata, "firstName") ?? "User",
            lastName: getMetadataValue(metadata, "lastName") ?? "",
            role: getMetadataValue(metadata, "role") ?? "STAFF",
            position: getMetadataValue(metadata, "position"),
          }
        }

        if (!user || !user.isActive) {
          return null
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)

        if (!isValid) {
          return null
        }

        try {
          await db.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })
        } catch (error) {
          console.error("Failed to update last login for fallback user:", error)
        }

        return {
          id: String(user.id),
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          position: user.position ?? undefined,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
        token.position = user.position
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.role = token.role as string
        session.user.position = token.position as string | undefined
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60
  }
}

export async function auth() {
  const session = await getServerSession(authOptions)
  return session
}
