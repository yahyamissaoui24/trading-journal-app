import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/plan";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await prisma.user.findUnique({
        where: { email: credentials.email.toLowerCase().trim() },
      });
      if (!user || !user.passwordHash) return null;

      const valid = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!valid) return null;

      return { id: user.id, email: user.email, name: user.name ?? undefined };
    },
  }),
];

// Google and Apple are optional — only registered once you've set credentials for them,
// so the app still runs fine (email/password only) before you get around to that.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    // Runs on every OAuth sign-in. We don't use the Prisma adapter (which would need
    // Account/Session tables), so we manually upsert a User row keyed by email.
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "apple") {
        if (!user.email) return false;
        await prisma.user.upsert({
          where: { email: user.email.toLowerCase().trim() },
          update: {
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          },
          create: {
            email: user.email.toLowerCase().trim(),
            name: user.name ?? null,
            image: user.image ?? null,
            passwordHash: null,
          },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      if (email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          select: { id: true, premiumUntil: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.plan = isPremium(dbUser.premiumUntil) ? "PREMIUM" : "FREE";
          token.premiumUntil = dbUser.premiumUntil ? dbUser.premiumUntil.toISOString() : null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as "FREE" | "PREMIUM") ?? "FREE";
        session.user.premiumUntil = (token.premiumUntil as string | null) ?? null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
