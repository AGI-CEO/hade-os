import NextAuth from "next-auth";
import type {
  User as NextAuthUser,
  Account,
  Profile,
  Session,
  SessionStrategy,
} from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
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
      async authorize(credentials): Promise<AdapterUser | null> {
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

        const { password: _, ...userWithoutPassword } = user;

        if (user.password === credentials.password) {
          console.log("Password matched (plain text)");
          return userWithoutPassword as AdapterUser;
        }

        console.log("Password did not match");
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: any;
      user: AdapterUser | NextAuthUser | undefined;
    }) {
      if (user) {
        console.log(
          "Setting JWT token data from user:",
          user.id,
          (user as any).userType
        );
        token.id = user.id;
        token.userType = (user as any).userType;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: any }) {
      if (token && session.user) {
        console.log(
          "Setting session data from token:",
          token.id,
          token.userType
        );
        session.user.id = token.id as string;
        session.user.userType = token.userType as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };
