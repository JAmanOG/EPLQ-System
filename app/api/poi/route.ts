import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth-utils"
import { encryptPOI } from "@/lib/encryption"

export async function GET(req: Request) {
  try {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    const url = new URL(req.url)
    const category = url.searchParams.get("category")

    // Query parameters
    const whereClause = category && category !== "all" ? { category } : {}

    // Get POIs from database
    const pois = await db.pOI.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Format POIs for response
    const formattedPois = pois.map((poi) => ({
      id: poi.id,
      name: poi.name, // Keep encrypted for security
      category: poi.category,
      location: `${poi.latitude.substring(0, 10)}...`, // Truncated for UI
      lastUpdated: poi.updatedAt.toISOString().split("T")[0],
      createdBy: `${poi.createdBy.firstName} ${poi.createdBy.lastName}`,
    }))

    return NextResponse.json({ pois: formattedPois })
  } catch (error) {
    console.error("Error fetching POIs:", error)
    return NextResponse.json({ error: "Failed to fetch POIs" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    // Check if admin
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { name, category, latitude, longitude, description } = body

    // Validate input
    if (!name || !category || !latitude || !longitude) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Encrypt POI data
    const encryptedData = encryptPOI({
      name,
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude),
      description: description || "",
    })

    // Create POI
    const poi = await db.pOI.create({
      data: {
        name: encryptedData.name,
        category,
        latitude: encryptedData.latitude,
        longitude: encryptedData.longitude,
        description: encryptedData.description,
        encryptionType: "AES256",
        createdById: decoded.id,
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        poi: {
          id: poi.id,
          category: poi.category,
          encryptionType: poi.encryptionType,
          createdAt: poi.createdAt,
        },
        message: "POI created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating POI:", error)
    return NextResponse.json({ error: "Failed to create POI" }, { status: 500 })
  }
}

