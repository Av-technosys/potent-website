import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isJwtUnexpired(token?: string) {
  if (!token) return false;

  try {
    const [, payload] = token.split(".");
    if (!payload) return false;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalizedPayload));
    const expiresAt = typeof decoded.exp === "number" ? decoded.exp * 1000 : 0;

    return expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const hasActiveAccessToken = isJwtUnexpired(accessToken);
  const canAttemptRefresh = !!refreshToken;
  const isAuth = hasActiveAccessToken || canAttemptRefresh;

  const pathname = req.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/register") ||
    pathname.startsWith("/admin/verify-otp") ||
    pathname.startsWith("/email-verification") ||
    pathname.startsWith("/reset-password-email") ||
    pathname.startsWith("/reset-password-otp") ||
    pathname.startsWith("/reset-password-confirm");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout");

  if (isAuthPage && hasActiveAccessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
