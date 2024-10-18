import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl });
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.log("Session callback:", { session, user, token });
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("JWT callback:", {
        token,
        user,
        account,
        profile,
        isNewUser,
      });
      return token;
    },
  },
});

export { handler as GET, handler as POST };
