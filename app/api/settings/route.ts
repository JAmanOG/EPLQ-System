import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth-utils"
import { db } from "@/lib/db"

// Get system settings
export async function GET() {
  try {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get or create settings
    let settings = await db.systemSettings.findFirst()
    
    if (!settings) {
      settings = await db.systemSettings.create({
        data: {
          encryptionAlgorithm: "AES-256 / Predicate-Only Encryption",
          queryTimeout: 30,
          maxResultsPerQuery: 100,
          indexRefreshInterval: 24,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error getting system settings:", error)
    return NextResponse.json({ error: "Failed to get system settings" }, { status: 500 })
  }
}

// Update system settings
export async function PUT(req: Request) {
  try {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { queryTimeout, maxResultsPerQuery, indexRefreshInterval } = body

    // Validate input
    if (typeof queryTimeout !== 'number' || queryTimeout < 1 || queryTimeout > 120) {
      return NextResponse.json({ error: "Query timeout must be between 1 and 120 seconds" }, { status: 400 })
    }

    if (typeof maxResultsPerQuery !== 'number' || maxResultsPerQuery < 1 || maxResultsPerQuery > 1000) {
      return NextResponse.json({ error: "Max results must be between 1 and 1000" }, { status: 400 })
    }

    if (typeof indexRefreshInterval !== 'number' || indexRefreshInterval < 1 || indexRefreshInterval > 168) {
      return NextResponse.json({ error: "Index refresh interval must be between 1 and 168 hours" }, { status: 400 })
    }

    // Get existing settings or create if not exists
    const existingSettings = await db.systemSettings.findFirst()

    const settings = existingSettings 
      ? await db.systemSettings.update({
          where: { id: existingSettings.id },
          data: {
            queryTimeout,
            maxResultsPerQuery,
            indexRefreshInterval,
            updatedById: decoded.id,
          },
        })
      : await db.systemSettings.create({
          data: {
            encryptionAlgorithm: "AES-256 / Predicate-Only Encryption",
            queryTimeout,
            maxResultsPerQuery,
            indexRefreshInterval,
            updatedById: decoded.id,
          },
        })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating system settings:", error)
    return NextResponse.json({ error: "Failed to update system settings" }, { status: 500 })
  }
}