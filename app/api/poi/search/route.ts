import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth-utils"
import { processPrivacyPreservingQuery } from "@/lib/spatial-query"

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const body = await req.json()
    const { encryptedLocation, category, radius, privacyLevel, anonymous } = body

    // Validate input
    if (!encryptedLocation || !encryptedLocation.latitude || !encryptedLocation.longitude) {
      return NextResponse.json({ error: "Missing location data" }, { status: 400 })
    }

    if (!radius || radius < 100 || radius > 5000) {
      return NextResponse.json({ error: "Invalid radius" }, { status: 400 })
    }

    // Process the privacy-preserving query
    const results = await processPrivacyPreservingQuery({
      encryptedLocation,
      category,
      radius,
      privacyLevel,
      userId: anonymous ? undefined : decoded.id,
    })

    // Log the query if not anonymous
    if (!anonymous) {
      await db.queryHistory.create({
        data: {
          userId: decoded.id,
          category: category || "all",
          radius,
          privacyLevel,
          resultCount: results.length,
        },
      })
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error processing query:", error)
    return NextResponse.json({ error: "An error occurred while processing your query" }, { status: 500 })
  }
}

