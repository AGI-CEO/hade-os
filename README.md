# HADE - Housing Agent Does Everything

![HADE Logo](/public/images/hade-logo.png)

HADE is an open-source property management software built by veterans for veterans, but it's 100% free for all real estate investors. Our mission is to make real estate investing and property management as fun as a game while helping you build real generational wealth.

## 🏠 About HADE

HADE (Housing Agent Does Everything) transforms property management into an engaging experience with a game-like interface. It helps real estate investors:

- Track property performance
- Manage tenants and maintenance requests
- Monitor financial metrics
- Streamline document management
- Simplify lease agreements
- Automate rental income tracking

## ✨ Features

- **Dashboard**: Get a quick overview of your entire portfolio
- **Property Management**: Track property details, occupancy, and value
- **Tenant Portal**: Dedicated area for tenants to pay rent, submit maintenance requests, and access documents
- **Financial Tracking**: Monitor rental income, expenses, and property value changes
- **Document Management**: Store and organize important property documents
- **Maintenance Requests**: Streamlined system for handling tenant maintenance issues
- **User Authentication**: Secure login system with role-based access (landlord/tenant) using NextAuth.js

## 🚀 Quick Deploy

You can clone this repo and deploy to Vercel in a few easy steps:

1. Fork this repository
2. Set up your Supabase database following the instructions in `README-PRISMA-SETUP.md`
3. Deploy to Vercel and configure the following environment variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `DIRECT_URL`: Same as DATABASE_URL for direct database access
   - `NEXTAUTH_URL`: Your application URL (e.g., https://yourdomain.com)
   - `NEXTAUTH_SECRET`: A secure random string for JWT encryption
   - `DEFAULT_LANDLORD_EMAIL`: (Optional) Custom landlord email
   - `DEFAULT_LANDLORD_PASSWORD`: (Optional) Custom landlord password
   - `DEFAULT_LANDLORD_NAME`: (Optional) Custom landlord name

The deployment will automatically run `prisma generate` during the build process to ensure the Prisma client is properly generated.

## 🛠️ Tech Stack

- Next.js
- TypeScript
- Prisma ORM
- Supabase (PostgreSQL)
- NextAuth.js for authentication
- Tailwind CSS
- Bun package manager

## 🔧 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Bun](https://bun.sh/)
- [Supabase Account](https://supabase.com/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AGI-CEO/hade-os.git
   cd hade-os
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Update with your Supabase credentials
   - Configure NextAuth.js by setting:
     - `NEXTAUTH_URL=http://localhost:3000`
     - `NEXTAUTH_SECRET=your-secure-random-string`
   - (Optional) Set custom landlord credentials:
     - `DEFAULT_LANDLORD_EMAIL=your-email@example.com`
     - `DEFAULT_LANDLORD_PASSWORD=your-secure-password`
     - `DEFAULT_LANDLORD_NAME=Your Name`
     - If left empty, the default test account (landlord@example.com/password123) will be used

4. Set up the database:

   - Follow the instructions in `README-PRISMA-SETUP.md`
   - Run database migrations:
     ```bash
     bun run prisma:migrate
     ```

5. Create test users (optional):

   ```bash
   bun run db:create-test-users
   ```

   This will create two test accounts:

   - Landlord: `landlord@example.com` / `password123`
   - Tenant: `tenant@example.com` / `password123`

6. Start the development server:
   ```bash
   bun run dev
   ```

## 🌟 Premium Version

While this open-source version is fully functional for managing a property, we offer a cloud-hosted premium version with advanced AI features for those looking to grow a real estate empire.

Learn more at [hade.ai](https://hade.ai)

## 👨‍💻 About the Creator

HADE is built by Blaise P, a veteran dedicated to making real estate investing accessible to everyone.

- Website: [blaisep.com](https://blaisep.com)
- YouTube: [@AGI_CEO](https://www.youtube.com/@AGI_CEO)
- Twitter: [@AGI_CEO](https://twitter.com/AGI_CEO)
- Instagram: [@a.i.ceo](https://www.instagram.com/a.i.ceo)
- LinkedIn: [Blaise Pascual](https://www.linkedin.com/in/blaise-pascual-62111924b/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
