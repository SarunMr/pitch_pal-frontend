import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/register", "/onboarding"];
const adminRoutes = ["/admin"];
const entrepreneurRoutes = ["/entrepreneur"];
const investorRoutes = ["/investor"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read cookies directly from request (no "use server" in proxy)
  const token = request.cookies.get("auth_token")?.value;
  const userDataRaw = request.cookies.get("user_data")?.value;
  const user = userDataRaw ? JSON.parse(userDataRaw) : null;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // No token → redirect to login if accessing protected route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && user) {
    // Already logged in → restrict public routes, redirect to their dashboard
    if (isPublicRoute) {
      if (user.role === "investor")
        return NextResponse.redirect(new URL("/investor", request.url));
      if (user.role === "entrepreneur")
        return NextResponse.redirect(new URL("/entrepreneur", request.url));
      if (user.role === "admin")
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Role based protection
    const isAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route),
    );
    const isEntrepreneurRoute = entrepreneurRoutes.some((route) =>
      pathname.startsWith(route),
    );
    const isInvestorRoute = investorRoutes.some((route) =>
      pathname.startsWith(route),
    );

    if (isAdminRoute && user.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (isEntrepreneurRoute && user.role !== "entrepreneur") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (isInvestorRoute && user.role !== "investor") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/investor/:path*",
    "/entrepreneur/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/onboarding",
    "/login",
    "/register",
  ],
};
