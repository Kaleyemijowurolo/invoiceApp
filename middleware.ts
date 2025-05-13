import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// // Define specific allowed origins (customize as needed)
const allowedOrigins = [
  "http://localhost:3000", // Development
  "http://localhost:3001", // Development
  "https://invoice-app-neon-phi.vercel.app",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin")!;

  // Skip CORS for same-origin requests
  if (!origin || origin === req.nextUrl.origin) {
    // Redirect authenticated users from home or auth pages to dashboard
    const token = await getToken({ req });
    if (token && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (token && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirect unauthenticated users from dashboard to signin
    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    return NextResponse.next();
  }

  // Handle CORS for API routes
  if (pathname.startsWith("/api/")) {
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods":
            "GET, POST, PATCH, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    if (!allowedOrigins.includes(origin)) {
      console.log(origin, "ORIGIN");
      console.log(allowedOrigins, "isallowedOrigin");
      return new NextResponse(
        JSON.stringify({ error: "CORS policy violated" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // Set CORS headers for allowed requests
  const res = NextResponse.next();
  // res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  if (allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");

  return res;
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/auth/:path*", "/api/:path*", "/dashboard/:path*"],
};
