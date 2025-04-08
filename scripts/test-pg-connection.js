const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  console.log('Testing connection to Supabase using pg...');
  
  // Try the direct connection first
  const directClient = new Client({
    connectionString: process.env.DIRECT_URL
  });
  
  try {
    console.log('Attempting to connect using DIRECT_URL...');
    await directClient.connect();
    const result = await directClient.query('SELECT NOW() as time');
    console.log('Direct connection successful!');
    console.log('Current time on database:', result.rows[0].time);
    await directClient.end();
  } catch (error) {
    console.error('Direct connection failed:', error.message);
    
    // Try the pooler connection
    try {
      console.log('\nAttempting to connect using DATABASE_URL...');
      const poolerClient = new Client({
        connectionString: process.env.DATABASE_URL
      });
      
      await poolerClient.connect();
      const result = await poolerClient.query('SELECT NOW() as time');
      console.log('Pooler connection successful!');
      console.log('Current time on database:', result.rows[0].time);
      await poolerClient.end();
    } catch (poolerError) {
      console.error('Pooler connection failed:', poolerError.message);
      console.log('\nBoth connection attempts failed. Please check your connection strings and network connectivity.');
    }
  }
}

testConnection();
