import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth-utils"

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" })
    removeAuthCookie(response.cookies)
    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "An error occurred during logout" }, { status: 500 })
  }
}

