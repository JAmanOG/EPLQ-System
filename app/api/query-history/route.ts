import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get("auth_token")?.value 
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const url = new URL(req.url)
    const category = url.searchParams.get("category")

    // Build where clause
    const whereClause: any = { userId: decoded.id }
    if (category && category !== "all") {
      whereClause.category = category
    }

    const history = await db.queryHistory.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    // Format history for response
    const formattedHistory = history.map((record) => ({
      id: record.id,
      date: record.createdAt.toISOString().split("T")[0],
      time: new Date(record.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      category: record.category || "All Categories",
      radius: record.radius,
      privacyLevel: record.privacyLevel,
      resultCount: record.resultCount,
    }))

    return NextResponse.json({ history: formattedHistory })
  } catch (error) {
    console.error("Error fetching query history:", error)
    return NextResponse.json({ error: "Failed to fetch query history" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
const token = (await cookies()).get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const body = await req.json()
    const { category, radius, privacyLevel, resultCount } = body

    const queryHistory = await db.queryHistory.create({
      data: {
        userId: decoded.id,
        category,
        radius,
        privacyLevel,
        resultCount,
      },
    })

    return NextResponse.json(
      {
        queryHistory,
        message: "Query history recorded successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error recording query history:", error)
    return NextResponse.json({ error: "Failed to record query history" }, { status: 500 })
  }
}

