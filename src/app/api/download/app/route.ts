import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform") || "android";

  if (platform === "ios") {
    // For iOS demo, return redirect or manifest info
    return NextResponse.redirect("https://apps.apple.com");
  }

  // Create a lightweight simulated APK binary file buffer
  const apkHeader = "PK\x03\x04AIVA Companion App Android Package v1.0.0\nCreated for AIVA AI Vision Assistant\n";
  const buffer = Buffer.from(apkHeader, "utf-8");

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": 'attachment; filename="AIVA_Companion_v1.0.0.apk"',
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
