#!/usr/bin/env node

/**
 * This script helps with introspecting the Supabase database schema
 * Run this after you've created your tables in Supabase
 */

const { execSync } = require('child_process');

console.log('Starting database introspection...');

try {
  // Run prisma db pull to introspect the database
  execSync('bunx prisma db pull', { stdio: 'inherit' });
  
  // Generate Prisma Client
  execSync('bunx prisma generate', { stdio: 'inherit' });
  
  console.log('\n✅ Database introspection completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Review the generated schema in prisma/schema.prisma');
  console.log('2. Make any necessary adjustments to the schema');
  console.log('3. Run `bunx prisma generate` if you make changes to the schema');
} catch (error) {
  console.error('\n❌ Error during introspection:', error.message);
  process.exit(1);
}
