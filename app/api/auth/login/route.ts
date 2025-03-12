import { NextResponse } from "next/server"
import { compare } from "bcrypt"
import { db } from "@/lib/db"
import { signToken, setAuthCookie } from "@/lib/auth-utils"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log("User account inactive:", user.status);

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if user is active
    if (user.status !== "ACTIVE") {
      console.log("User account inactive:", user.status);
      return NextResponse.json({ error: "Account is inactive" }, { status: 401 })
    }

    console.log("User found:", user);

    // Verify password
    const passwordValid = await compare(password, user.password)

    if (!passwordValid) {
      console.log("Invalid credentials");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Generate token
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    // Create response
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      message: "Login successful",
    })

    // Set auth cookie on the response
    setAuthCookie(token, response.cookies)

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

