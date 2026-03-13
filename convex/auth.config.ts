import type { AuthConfig } from "convex/server";

const issuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;
if (!issuerDomain) {
  throw new Error("Missing CLERK_JWT_ISSUER_DOMAIN.");
}

export default {
  providers: [
    {
      // Replace with your Clerk Frontend API URL
      // or with `process.env.CLERK_JWT_ISSUER_DOMAIN`
      // and configure CLERK_JWT_ISSUER_DOMAIN on the Convex Dashboard
      // See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
      domain: issuerDomain,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
