import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { verifyAuthToken } from "@/lib/auth/jwt";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth/secret";

const protectedRoutes = ["/orders", "/wishlist", "/cart", "/admin"];

export default async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isProtected) {
    return NextResponse.next();
  }

  const legacyToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (legacyToken) {
    try {
      const payload = await verifyAuthToken(legacyToken);
      if (isAdminRoute && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } catch {
      // Try OAuth token fallback below
    }
  }

  const oauthToken = await getToken({
    req: request,
    secret: getAuthSecret(),
  });

  if (oauthToken) {
    if (isAdminRoute && oauthToken.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
