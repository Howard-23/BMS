import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      email: string
      firstName: string
      lastName: string
      role: string
      position?: string
    }
  }

  interface User {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
    role: string
    position?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    username?: string
    role?: string
    position?: string
    firstName?: string
    lastName?: string
  }
}
