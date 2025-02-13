import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Define public routes that do not require authentication
  const publicRoutes = ["/login", "/api/auth", "/"];

  // Allow public routes without authentication
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based access control
  if (pathname.startsWith("/admin")) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL(`/${token.name}/Inventory`, req.url));
    }
  }

  return NextResponse.next();
}

// Configure paths that trigger the middleware
export const config = {
  matcher: ["/admin/:path*", "/:username/:path*"], // Simplified matcher for efficiency
};
