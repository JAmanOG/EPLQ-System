import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const decoded = verifyToken(token)
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    
    // Get total users count
    const totalUsers = await db.user.count()
    
    // Get inactive users count
    const inactiveUsers = await db.user.count({
      where: {
        status: "INACTIVE"
      }
    })
    
    // Get admin users count
    const adminUsers = await db.user.count({
      where: {
        role: "ADMIN"
      }
    })
    
    // Get new users in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const newUsers = await db.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })
    
    return NextResponse.json({
      totalUsers,
      inactiveUsers,
      adminUsers,
      newUsers
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user statistics" }, { status: 500 })
  }
}