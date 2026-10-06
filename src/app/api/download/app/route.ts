import { NextResponse } from "next/server";
import { APP_DOWNLOAD } from "@/lib/app-download";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform") || "android";

  if (platform !== "android") {
    return NextResponse.json(
      { error: "Chưa có bản tải xuống cho nền tảng này." },
      { status: 404 }
    );
  }
  const response = NextResponse.redirect(APP_DOWNLOAD.releaseUrl, 307);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
