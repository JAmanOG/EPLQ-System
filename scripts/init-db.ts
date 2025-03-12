import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash("admin123", 12)
    await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
        email: "admin@example.com",
        firstName: "Admin",
        lastName: "User",
        password: adminPassword,
        role: "ADMIN",
      },
    })

    // Create test user
    const userPassword = await hash("user123", 12)
    await prisma.user.upsert({
      where: { email: "user@example.com" },
      update: {},
      create: {
        email: "user@example.com",
        firstName: "Test",
        lastName: "User",
        password: userPassword,
        role: "USER",
      },
    })

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

