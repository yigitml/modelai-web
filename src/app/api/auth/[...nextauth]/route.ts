import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    ...authOptions.callbacks,
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url === '/camera') return `${baseUrl}/camera`;
      return baseUrl;
    },
  },
});

export { handler as GET, handler as POST };
