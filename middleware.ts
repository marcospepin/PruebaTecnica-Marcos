import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Proteger rutas de maestro
    if (path.startsWith("/maestro") && token?.role !== "maestro") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Proteger rutas de cuidador
    if (path.startsWith("/cuidador") && token?.role !== "cuidador") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/maestro/:path*", "/cuidador/:path*"],
};
