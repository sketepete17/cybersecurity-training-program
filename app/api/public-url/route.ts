import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  // Prefer explicit env, then Vercel production URL, then Vercel branch URL
  const envUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "");

  if (envUrl) {
    return NextResponse.json({ url: envUrl });
  }

  // Fallback: derive from the Host header of the incoming request
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const proto = headersList.get("x-forwarded-proto") || "https";

  if (host) {
    return NextResponse.json({ url: `${proto}://${host}` });
  }

  return NextResponse.json({ url: "" });
}
