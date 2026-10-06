import { describe, expect, it } from "vitest";
import { APP_DOWNLOAD } from "@/lib/app-download";
import { GET } from "./route";

describe("companion app download", () => {
  it("redirects Android requests to the versioned APK release", async () => {
    const response = await GET(
      new Request("https://aiva.id.vn/api/download/app?platform=android")
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(APP_DOWNLOAD.releaseUrl);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("defaults QR links without a platform to Android", async () => {
    const response = await GET(
      new Request("https://aiva.id.vn/api/download/app")
    );
    expect(response.headers.get("Location")).toBe(APP_DOWNLOAD.releaseUrl);
  });

  it("does not pretend an iOS build is available", async () => {
    const response = await GET(
      new Request("https://aiva.id.vn/api/download/app?platform=ios")
    );
    expect(response.status).toBe(404);
    expect(response.headers.has("Location")).toBe(false);
  });
});
