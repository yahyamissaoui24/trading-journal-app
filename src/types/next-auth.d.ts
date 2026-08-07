import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      plan: "FREE" | "PREMIUM";
      premiumUntil: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan: "FREE" | "PREMIUM";
    premiumUntil: string | null;
  }
}
