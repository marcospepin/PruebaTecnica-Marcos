import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Skip files with extensions (images, fonts, etc.)
  ) {
    return NextResponse.next();
  }
  
  // Get locale from cookie or default to 'es'
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/auth/login", "/auth/register"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    const response = NextResponse.next();
    // Pass locale to the request for next-intl
    response.headers.set('x-next-intl-locale', locale);
    return response;
  }

  // Si no hay token y la ruta no es pública, redirigir al login
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verificar roles
  const role = token.role as string;

  if (pathname.startsWith("/maestro") && role !== "maestro") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname.startsWith("/cuidador") && role !== "cuidador") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const response = NextResponse.next();
  // Pass locale to the request for next-intl
  response.headers.set('x-next-intl-locale', locale);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - files with extensions (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|eot)$).*)',
  ],
};
