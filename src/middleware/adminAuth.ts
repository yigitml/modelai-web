import { NextRequest } from "next/server";
import { withProtectedRoute } from "./jwtAuth";

export const withAdminRoute = (handler: Function) =>
  withProtectedRoute(async (req: NextRequest) => {
    const user = req.user;
    
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    if (!adminEmails.includes(user!.email!)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    return handler(req);
  });