// import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/lib/auth"
// import { db } from "@/lib/db"

// // Get all users (admin only)
// export async function GET(req: Request) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session || session.user.role !== "ADMIN") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const users = await db.user.findMany({
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         role: true,
//         createdAt: true,
//         lastLogin: true,
//         status: true,
//       },
//       orderBy: { createdAt: "desc" },
//     })

//     return NextResponse.json({ users })
//   } catch (error) {
//     console.error("Error fetching users:", error)
//     return NextResponse.json({ error: "An error occurred while fetching users" }, { status: 500 })
//   }
// }

// // Update user status (admin only)
// export async function PATCH(req: Request) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session || session.user.role !== "ADMIN") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await req.json()
//     const { userId, status } = body

//     const user = await db.user.update({
//       where: { id: userId },
//       data: { status },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         role: true,
//         status: true,
//       },
//     })

//     return NextResponse.json({ user, message: "User updated successfully" })
//   } catch (error) {
//     console.error("Error updating user:", error)
//     return NextResponse.json({ error: "An error occurred while updating user" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { verifyToken } from "@/lib/auth-utils"

// Get all users (admin only)
export async function GET(req: Request) {
  try {
const token = (await cookies()).get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // Format users for response
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin ? user.lastLogin.toISOString() : null,
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "An error occurred while fetching users" }, { status: 500 })
  }
}

// Update user status (admin only)
export async function PATCH(req: Request) {
  try {
const token = (await cookies()).get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { userId, status } = body

    if (!userId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "An error occurred while updating user" }, { status: 500 })
  }
}

