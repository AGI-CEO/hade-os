# Setting Up Prisma with Supabase

This guide will help you set up Prisma ORM with your Supabase PostgreSQL database.

## Prerequisites

- A Supabase project
- Access to the Supabase SQL Editor
- Node.js and Bun installed

## Step 1: Create a Prisma User in Supabase

First, you need to create a dedicated user for Prisma in your Supabase database:

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to the SQL Editor
4. Create a new query
5. Copy and paste the contents of `scripts/create-prisma-user.sql`
6. Run the query

This will create a user named `prisma`. Make sure to replace the placeholder password in the SQL script with a strong, secure password of your own.

## Step 2: Set Up Your Environment Variables

1. Copy the `.env.example` file to `.env` (the `.env` file is gitignored for security)
2. Update the `.env` file with your actual values:

```
# Used for Prisma Migrations and within your application
DATABASE_URL="postgres://prisma.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:5432/postgres"

# Direct connection to the database. Used for migrations.
DIRECT_URL="postgres://prisma.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:5432/postgres"
```

Replace:

- `YOUR_PROJECT_REF` with your Supabase project reference
- `YOUR_REGION` with your Supabase database region (e.g., us-east-1)
- `YOUR_PASSWORD` with the secure password you created for the prisma user

## Step 3: Run Migrations

Now you can run your Prisma migrations:

```bash
bun run prisma:migrate
```

Or create a new migration:

```bash
bunx prisma migrate dev --name init
```

## Step 4: Generate Prisma Client

After running migrations, generate the Prisma client:

```bash
bun run prisma:generate
```

## Step 5: Use Prisma in Your Application

You can now use Prisma in your application:

```typescript
import prisma from "@/lib/prisma";

// Example: Get all properties
const properties = await prisma.property.findMany();
```

## Troubleshooting

If you encounter connection issues:

1. Verify your connection strings in the `.env` file
2. Make sure the prisma user was created successfully in Supabase
3. Check that your IP address is allowed in Supabase's network restrictions

For more information, see the [Prisma documentation for Supabase](https://supabase.com/docs/guides/database/prisma).

## Security Best Practices

1. **Never commit sensitive information to your repository**

   - The `.env` file is included in `.gitignore` to prevent accidentally committing secrets
   - Use `.env.example` as a template without real credentials

2. **Use strong, unique passwords**

   - Generate a strong password for the Prisma database user
   - Don't reuse passwords from other services

3. **Rotate credentials regularly**

   - Periodically update the database password
   - Update your `.env` file when credentials change

4. **Limit database user permissions**
   - The SQL script creates a user with the minimum necessary permissions
   - Consider further restricting permissions in production environments
