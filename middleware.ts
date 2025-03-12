import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// import { verify } from "jsonwebtoken"
import * as jose from 'jose'  // Edge-compatible JWT library


const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-do-not-use-in-production"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  console.log("Token is there or not", token) 

  // Check if user is trying to access protected routes
  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/user")) {
    console.log("Protected route")
    if (!token) {
      console.log("No token")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      // const decoded = verify(token, JWT_SECRET) as { role: string }
      const encoder = new TextEncoder()
      const secretKey = encoder.encode(JWT_SECRET)
      const { payload } = await jose.jwtVerify(token, secretKey)

      const decoded = payload as { role: string }
      // console.log("Decoded", decoded)

      // Check if admin is trying to access admin routes
      if (request.nextUrl.pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Check if user is trying to access user routes
      if (request.nextUrl.pathname.startsWith("/user") && decoded.role !== "USER") {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      return NextResponse.next()
    } catch (error) {
      // Invalid token
      console.error("Token error:", error)
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
}

