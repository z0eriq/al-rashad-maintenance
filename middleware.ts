import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/jwt";

const publicAdminPaths = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // إعادة توجيه صفحات العملاء القديمة
  if (pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/book", request.url));
  }
  if (pathname === "/login" || pathname === "/register") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (pathname === "/forgot-password") {
    return NextResponse.redirect(new URL("/admin/forgot-password", request.url));
  }
  if (pathname === "/reset-password") {
    const resetToken = request.nextUrl.searchParams.get("token");
    const target = resetToken
      ? `/admin/reset-password?token=${resetToken}`
      : "/admin/reset-password";
    return NextResponse.redirect(new URL(target, request.url));
  }

  const isAdminArea = pathname.startsWith("/admin");
  const isPublicAdminPath = publicAdminPaths.includes(pathname);

  if (!isAdminArea) {
    return NextResponse.next();
  }

  const user = token ? await verifyToken(token) : null;

  if (isPublicAdminPath) {
    if (user?.role === "ADMIN" && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/book", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
