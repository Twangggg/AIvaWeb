import { NextResponse, type NextRequest } from "next/server";

const VERIFICATION_RE = /^\/google([A-Za-z0-9]+)\.html$/;

export function middleware(request: NextRequest) {
  const match = VERIFICATION_RE.exec(request.nextUrl.pathname);
  if (match) {
    const token = match[1];
    return new NextResponse(`google-site-verification: google${token}.html`, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store, max-age=0",
        "cdn-cache-control": "no-store",
        "pragma": "no-cache",
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt).*)"],
};