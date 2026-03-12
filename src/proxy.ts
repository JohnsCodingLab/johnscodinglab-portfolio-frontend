import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login"];
const AUTH_ROUTES = ["/login"]; // Routes only for unauthenticated users

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSession = request.cookies.get("has_session")?.value === "true";

    // If user is authenticated and tries to go to /login, redirect to dashboard
    if (hasSession && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If user is not authenticated and tries to access a protected route
    if (!hasSession && !PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
        const loginUrl = new URL("/login", request.url);
        // Remember where they were trying to go so we can redirect back after login
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths EXCEPT:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - Public files with extensions (images, fonts etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
    ],
};
