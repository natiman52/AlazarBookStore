import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
 import { customSession,username } from "better-auth/plugins";
import {prisma} from '@/lib/prisma';

/**
 * Reuse a single Prisma instance across hot reloads
 * to avoid exhausting the database connection pool.
 */



export const auth = betterAuth({
  /**
   * Set the canonical base URL so Better Auth can generate
   * absolute links (e.g. verification emails).
   */
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  /**
   * Secret is required for signing tokens and email verification links.
   * Use a strong random string in production.
   */
  secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
    provider: "mysql",
    }),
    emailAndPassword: { 
    enabled: true, 
    /**
     * Keep auto sign-in on, and skip verification for now.
     * Flip to true once an email provider is wired.
     */
    requireEmailVerification: false,
  },
  /**
   * Limit where auth requests can originate from.
   * Add more origins if you host on multiple domains.
   */
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : undefined,
  ].filter(Boolean) as string[],
  plugins: [
    username(),
    customSession(async ({ user, session }) => {
      // Fetch the latest role from your own User table,
      // since Better Auth's default user shape doesn't know about custom fields.
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      });

      const role = dbUser?.role ?? "user";

      return {
        // Custom top-level field – easy to check both on client and server
        isAdmin: role === "admin",
        // Expose role on the user object so you can still use `session.user.role`
        user: { ...user, role },
        session,
      };
    }),
  ],
});