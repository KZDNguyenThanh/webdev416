import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { getAuthSecret } from "@/lib/auth/secret";

function oauthPasswordPlaceholder() {
  return `oauth-google-${crypto.randomUUID()}`;
}

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "replace-google-client-id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "replace-google-client-secret",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") {
        return true;
      }

      const email = user.email?.trim().toLowerCase();
      if (!email) {
        return false;
      }

      const existing = await prisma.user.findUnique({ where: { email } });

      if (existing && !existing.isActive) {
        return false;
      }

      await prisma.user.upsert({
        where: { email },
        update: {
          fullName: user.name || existing?.fullName || null,
          avatarUrl: user.image || existing?.avatarUrl || null,
          emailVerified: true,
          lastLoginAt: new Date(),
        },
        create: {
          email,
          fullName: user.name || null,
          avatarUrl: user.image || null,
          emailVerified: true,
          passwordHash: oauthPasswordPlaceholder(),
          lastLoginAt: new Date(),
        },
      });

      return true;
    },
    async jwt({ token }) {
      const email = token.email?.trim().toLowerCase();
      if (!email) {
        return token;
      }

      const dbUser = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          role: true,
          fullName: true,
          isActive: true,
        },
      });

      if (!dbUser || !dbUser.isActive) {
        return token;
      }

      token.uid = dbUser.id;
      token.role = dbUser.role;
      token.name = dbUser.fullName || token.name;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.uid === "string" ? token.uid : "";
        session.user.role = token.role === "ADMIN" ? "ADMIN" : "CUSTOMER";
        session.user.fullName = session.user.name || null;
      }

      return session;
    },
  },
};
