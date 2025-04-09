import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        console.log("Attempting to authorize user:", credentials.email);

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.log("User not found:", credentials.email);
          return null;
        }

        console.log("User found:", user.email, "Checking password...");

        // For users migrated from the old system who have plain text passwords
        if (user.password === credentials.password) {
          console.log("Password matched (plain text)");
          // In a production app, you would hash the password here
          // and update the user record with the hashed password
          return user;
        }

        // For new users with hashed passwords (future implementation)
        // if (user.password && (await compare(credentials.password, user.password))) {
        //   console.log("Password matched (hashed)");
        //   return user;
        // }

        console.log("Password did not match");
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log(
          "Setting JWT token data from user:",
          user.id,
          user.userType
        );
        token.id = user.id;
        token.userType = user.userType;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        console.log(
          "Setting session data from token:",
          token.id,
          token.userType
        );
        session.user.id = token.id;
        session.user.userType = token.userType;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
