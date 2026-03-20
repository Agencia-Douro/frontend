import { NextRequest, NextResponse } from "next/server";

type GeoIpResponse = {
  countryCode: string | null;
  source: "ipapi" | "none";
};

function getClientIp(request: NextRequest): string | null {
  const xff = request.headers.get("x-forwarded-for");
  const xri = request.headers.get("x-real-ip");

  const ip =
    (xff ? xff.split(",")[0]?.trim() : null) ??
    (xri ? xri.trim() : null) ??
    null;

  if (!ip) return null;
  if (ip === "::1" || ip === "127.0.0.1") return null;
  return ip;
}

async function resolveCountryCodeFromIp(ip: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: controller.signal,
      headers: {
        "accept": "application/json",
      },
    });

    if (!res.ok) return null;
    const data = (await res.json()) as any;

    const code: string | undefined =
      data?.country_code ?? data?.country_code2 ?? data?.countryCode;

    if (!code || typeof code !== "string") return null;
    return code.toLowerCase();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!ip) {
      const body: GeoIpResponse = { countryCode: null, source: "none" };
      return NextResponse.json(body);
    }

    const countryCode = await resolveCountryCodeFromIp(ip);
    const body: GeoIpResponse = { countryCode, source: "ipapi" };
    return NextResponse.json(body);
  } catch {
    const body: GeoIpResponse = { countryCode: null, source: "none" };
    return NextResponse.json(body, { status: 200 });
  }
}

