import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123', // In a real app, this would be hashed
      role: 'user',
    },
  })

  console.log(`Created user with id: ${user.id}`)

  // Create some properties
  const property1 = await prisma.property.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      address: '123 Main St',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house%201-2A4jS3pKxw2ZYNnZw1suipKoGBkriL.jpeg',
      value: 450000,
      occupancy: 'occupied',
      rentAmount: 2200,
      rentDue: new Date('2023-05-01'),
      userId: user.id,
    },
  })

  const property2 = await prisma.property.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      address: '456 Oak Ave',
      city: 'San Antonio',
      state: 'TX',
      zipCode: '78205',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house2-jcDyCtfDDcUMusg6iM6KDVh2JwqXri.webp',
      value: 1250000,
      occupancy: 'vacant',
      rentAmount: null,
      rentDue: null,
      userId: user.id,
    },
  })

  console.log(`Created properties with ids: ${property1.id}, ${property2.id}`)

  // Create some maintenance requests
  const maintenanceRequest = await prisma.maintenanceRequest.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      title: 'Leaking Faucet',
      description: 'The kitchen faucet is leaking and needs repair.',
      status: 'pending',
      priority: 'medium',
      propertyId: property1.id,
    },
  })

  console.log(`Created maintenance request with id: ${maintenanceRequest.id}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
