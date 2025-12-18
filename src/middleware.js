import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client for the Edge
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. EXCEPTIONS: Always let these paths through
  if (
    pathname.startsWith("/admin/master-controller") || // Admin Panel
    pathname.startsWith("/beta-login") || // The Login Gate itself
    pathname.startsWith("/_next") || // Next.js internals
    pathname.startsWith("/api") || // API routes
    pathname.startsWith("/static") || // Static files
    pathname.includes(".") // Files like .jpg, .css
  ) {
    return NextResponse.next();
  }

  try {
    // 2. CHECK DATABASE: Is the "Site Lock" turned on?
    // We fetch the 'site_lock' row from app_settings
    const { data, error } = await supabase
      .from("app_settings")
      .select("is_active")
      .eq("setting_name", "site_lock")
      .single();

    // Default to TRUE (Locked) if DB fails or row missing (Security First)
    const isLocked = data ? data.is_active : true;

    // 3. IF SITE IS OPEN (isLocked = false), LET EVERYONE IN
    if (!isLocked) {
      return NextResponse.next();
    }

    // 4. IF SITE IS LOCKED, CHECK FOR COOKIE
    const betaCookie = request.cookies.get("cinesonic-beta-access");

    if (!betaCookie) {
      // No cookie? Redirect to the Gate.
      const loginUrl = new URL("/beta-login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Cookie exists? Enter.
    return NextResponse.next();
  } catch (err) {
    // If something catastrophically fails, default to safe behavior (allow or block based on preference)
    console.error("Middleware Error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/:path*",
};
