import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await hash("admin123", 12)
  const userPassword = await hash("user123", 12)

  // Create admin user
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

  // Create regular user
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

