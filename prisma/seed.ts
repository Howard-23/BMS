import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'admin' }
  })

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10)
    
    await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@barangaymo.com',
        passwordHash,
        firstName: 'Barangay',
        lastName: 'Administrator',
        role: 'ADMIN',
        position: 'Barangay Captain',
        isActive: true
      }
    })
    console.log('Default admin created: username=admin, password=admin123')
  } else {
    console.log('Admin user already exists')
  }

  // Check if barangay info exists
  const existingInfo = await prisma.barangayInfo.findFirst()

  if (!existingInfo) {
    await prisma.barangayInfo.create({
      data: {
        name: 'Sample Barangay',
        city: 'Sample City',
        province: 'Sample Province'
      }
    })
    console.log('Default barangay info created')
  } else {
    console.log('Barangay info already exists')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
