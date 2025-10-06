import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Load allowed origins from env
const allowedOrigins =
  process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(",") || [];

// Regex to match any localhost port (e.g. 3000, 5173, 8080, etc.)
const localhostRegex = /^http:\/\/localhost:\d+$/;

export function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "";

  const isAllowed =
    localhostRegex.test(origin) || allowedOrigins.includes(origin);

  const res = NextResponse.next();

  // Set CORS headers
  res.headers.set("Access-Control-Allow-Origin", isAllowed ? origin : "");
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { headers: res.headers });
  }

  return res;
}

export const config = {
  matcher: "/api/:path*", // apply only to API routes
};
