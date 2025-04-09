# Deploying HADE to Vercel

This guide provides detailed instructions for deploying the HADE application to Vercel.

## Prerequisites

Before deploying to Vercel, make sure you have:

1. A [Vercel account](https://vercel.com/signup)
2. A [Supabase account](https://supabase.com/) with a project set up
3. Created the Prisma user in your Supabase database (see `README-PRISMA-SETUP.md`)

## Deployment Steps

### 1. Fork or Clone the Repository

First, fork or clone this repository to your GitHub account.

### 2. Set Up Your Supabase Database

Follow the instructions in `README-PRISMA-SETUP.md` to set up your Supabase database and create the necessary Prisma user.

### 3. Deploy to Vercel

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Build Command: Will be automatically set to `prisma generate && node scripts/init-landlord-from-env.js && next build` (from vercel.json)
   - Output Directory: Leave as default (.next)

### 4. Configure Environment Variables

Add the following environment variables in the Vercel project settings:

- `DATABASE_URL`: Your Supabase connection string

  ```
  postgres://prisma.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:5432/postgres
  ```

- `DIRECT_URL`: Same as DATABASE_URL for direct database access

  ```
  postgres://prisma.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:5432/postgres
  ```

- `NEXTAUTH_URL`: Your application URL (e.g., https://yourdomain.vercel.app)

- `NEXTAUTH_SECRET`: A secure random string for JWT encryption

- (Optional) Custom landlord credentials:
  - `DEFAULT_LANDLORD_EMAIL`: Email for the landlord account
  - `DEFAULT_LANDLORD_PASSWORD`: Password for the landlord account
  - `DEFAULT_LANDLORD_NAME`: Name for the landlord account

Replace:

- `YOUR_PROJECT_REF` with your Supabase project reference
- `YOUR_REGION` with your Supabase database region (e.g., us-east-1)
- `YOUR_PASSWORD` with the secure password you created for the prisma user

### 5. Deploy

Click "Deploy" and wait for the build to complete.

## Troubleshooting

### Prisma Client Generation Error

If you encounter an error related to Prisma client generation, make sure:

1. The `DATABASE_URL` and `DIRECT_URL` environment variables are correctly set
2. The Prisma user has been created in your Supabase database
3. The password in your connection string matches the one you set for the Prisma user

### Database Connection Issues

If your application can't connect to the database:

1. Check that your Supabase project is active
2. Verify that the connection strings are correct
3. Make sure your Supabase database allows connections from Vercel's IP ranges

## Updating Your Deployment

When you push changes to your repository, Vercel will automatically redeploy your application. The build process will:

1. Install dependencies
2. Generate the Prisma client
3. Initialize the landlord account from environment variables (if provided)
4. Build the Next.js application

This ensures that the Prisma client is always up-to-date with your schema.
