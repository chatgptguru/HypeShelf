import { AuthConfig } from "convex/server";

/**
 * Clerk JWT issuer must be set in Convex dashboard as CLERK_JWT_ISSUER_DOMAIN.
 * Create a JWT template named "convex" in Clerk and use its issuer URL.
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
