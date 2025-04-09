const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function initLandlordFromEnv() {
  console.log('Initializing landlord account from environment variables...');
  
  // Get credentials from environment variables
  const email = process.env.DEFAULT_LANDLORD_EMAIL;
  const password = process.env.DEFAULT_LANDLORD_PASSWORD;
  const name = process.env.DEFAULT_LANDLORD_NAME || 'HADE Admin';
  
  // If no email or password is provided, skip creation
  if (!email || !password) {
    console.log('No DEFAULT_LANDLORD_EMAIL or DEFAULT_LANDLORD_PASSWORD provided in .env');
    console.log('Skipping landlord account creation. Using default test account.');
    return;
  }
  
  const prisma = new PrismaClient({
    log: ['error'],
  });
  
  try {
    // Test database connection
    console.log('Testing database connection...');
    const connectionTest = await prisma.$queryRaw`SELECT current_timestamp as time, current_user as user`;
    console.log('Connection successful:', connectionTest);
    
    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      console.log(`User with email ${email} already exists. Skipping creation.`);
      return;
    }
    
    // Create the landlord user
    console.log(`Creating landlord user with email: ${email}...`);
    const landlord = await prisma.user.create({
      data: {
        email,
        name,
        password,
        role: 'user',
        userType: 'landlord',
      },
    });
    
    console.log(`Created landlord user with id: ${landlord.id}`);
    
    // Create a default property for the landlord
    console.log('Creating default property...');
    const property = await prisma.property.create({
      data: {
        address: '123 HADE St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house%201-2A4jS3pKxw2ZYNnZw1suipKoGBkriL.jpeg',
        value: 350000,
        occupancy: 'vacant',
        rentAmount: 1800,
        rentDue: new Date(new Date().setDate(1)),
        userId: landlord.id,
      },
    });
    
    console.log(`Created property with id: ${property.id}`);
    console.log('Landlord account initialization complete!');
    
  } catch (error) {
    console.error('Error initializing landlord account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initLandlordFromEnv();
