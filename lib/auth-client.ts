import { createAuthClient } from "better-auth/react";
import { customSessionClient,usernameClient } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  /**
   * Keep requests on the same origin by default.
   * Override with NEXT_PUBLIC_APP_URL if you host the API elsewhere.
   */
  baseURL:
    (process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`
      : undefined) ?? "/api/auth",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [usernameClient(),customSessionClient<typeof auth>()],
});