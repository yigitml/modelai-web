import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return "/";
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
