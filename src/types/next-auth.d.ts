// Remove or comment out the unused import
// import NextAuth from "next-auth"

// If you need to extend the session type, you can do it like this:
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    // Add any custom properties to the session here
    idToken?: string;
    // other custom properties...
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
  }
}
