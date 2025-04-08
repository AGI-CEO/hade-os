# Using Prisma with Supabase

This project uses Prisma ORM with Supabase as the database provider.

## Setup Instructions

### 1. Create the Database Schema in Supabase

You can create the database schema in Supabase in one of two ways:

#### Option 1: Using the Supabase Dashboard SQL Editor

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `schema.sql` into the editor
5. Run the query to create the tables

#### Option 2: Using the Supabase API

You can also use the Supabase API to execute the SQL script programmatically.

### 2. Configure Environment Variables

Make sure your `.env` file contains the correct connection strings:

```
# Connect to Supabase via Shared Connection Pooler
DATABASE_URL="postgresql://postgres.eyyctoxflssrrlwzzvuy:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database through Shared Pooler (supports IPv4/IPv6). Used for migrations.
DIRECT_URL="postgresql://postgres.eyyctoxflssrrlwzzvuy:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

Replace `[YOUR-PASSWORD]` with your Supabase database password or service role key.

### 3. Introspect the Database

After creating the schema in Supabase, run the introspection script to generate the Prisma schema:

```
bun run db:introspect
```

This will:
1. Pull the database schema from Supabase
2. Generate the Prisma Client based on the schema

### 4. Generate Prisma Client

If you make any changes to the Prisma schema, regenerate the client:

```
bun run prisma:generate
```

## Using Prisma in Your Application

Once set up, you can use Prisma Client in your application:

```typescript
import prisma from '@/lib/prisma';

// Example: Get all properties
const properties = await prisma.property.findMany();
```

## Troubleshooting

If you encounter connection issues:

1. Verify your connection strings in the `.env` file
2. Make sure your IP address is allowed in Supabase's network restrictions
3. Check that the service role key has the necessary permissions

For more information, see the [Prisma documentation for Supabase](https://www.prisma.io/docs/orm/overview/databases/supabase).
