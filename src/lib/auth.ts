import { type NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase();

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
    }),
    // Temporary campus-email login — remove once UNSW OAuth is live
    CredentialsProvider({
      id: "campus-email",
      name: "Campus Email",
      credentials: {
        email: { label: "Campus Email", type: "email" },
        name: { label: "Name", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email?.trim()) return null;
        const email = credentials.email.trim().toLowerCase();
        const name = credentials.name?.trim() || email.split("@")[0];

        const roleStr = credentials.role === "ADMIN" || adminEmails.includes(email) ? "ADMIN" : "STUDENT";
        const role = roleStr as Role;

        const dbUser = await prisma.user.upsert({
          where: { email },
          update: { name },
          create: { email, name, role },
        });

        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role as "STUDENT" | "ADMIN",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      if (allowedDomain && !user.email.toLowerCase().endsWith(`@${allowedDomain}`)) {
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const email = user.email.toLowerCase();
        const dbUser = await prisma.user.findUnique({ where: { email } });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role as "STUDENT" | "ADMIN";
        } else {
          const roleStr = adminEmails.includes(email) ? "ADMIN" : "STUDENT";
          const role = roleStr as Role;
          const newUser = await prisma.user.upsert({
            where: { email },
            update: { name: user.name, image: user.image },
            create: { email, name: user.name, image: user.image, role },
          });
          token.id = newUser.id;
          token.role = newUser.role as "STUDENT" | "ADMIN";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "STUDENT" | "ADMIN";
      }
      return session;
    },
  },
};
