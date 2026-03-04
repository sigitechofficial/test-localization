import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["en", "es", "ar", "tr", "pl", "de"] as const;
const DEFAULT_LOCALE = "en";
const LOCALE_COOKIE = "NEXT_LOCALE";

type Locale = (typeof SUPPORTED_LOCALES)[number];

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

function getPathLocale(pathname: string): Locale | null {
  const seg = pathname.split("/")[1] || "";
  return isLocale(seg) ? seg : null;
}

function getClientCountry(req: NextRequest): string | null {
  // On Vercel, NextRequest.geo?.country is available at the Edge in production.
  const geoCountry = (req as any).geo?.country ?? null;

  // Also check common headers (Vercel / Cloudflare / custom reverse proxy).
  const headerCountry =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country-code") ||
    null;

  return (geoCountry || headerCountry)?.toUpperCase() ?? null;
}

function localeFromCountry(country: string | null): Locale | null {
  if (!country) return null;

  const map: Record<string, Locale> = {
    DE: "de",
    ES: "es",
    TR: "tr",
    PL: "pl",
    // Arabic-speaking examples (extend as you like)
    SA: "ar",
    AE: "ar",
    EG: "ar",
    QA: "ar",
    KW: "ar",
    BH: "ar",
    OM: "ar",
    JO: "ar",
    LB: "ar",
    MA: "ar",
    DZ: "ar",
    TN: "ar",
    IQ: "ar",
  };

  return map[country] ?? null;
}

function localeFromAcceptLanguage(headerValue: string | null): Locale | null {
  if (!headerValue) return null;

  // Example: "en-US,en;q=0.9,es;q=0.8"
  const parts = headerValue.split(",");
  for (const p of parts) {
    const tag = p.trim().split(";")[0]?.toLowerCase() || "";
    const primary = tag.split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return null;
}

function resolveLocale(req: NextRequest): { locale: Locale; source: "cookie" | "country" | "accept-language" | "default" } {
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value?.toLowerCase() || "";
  if (isLocale(cookieLocale)) return { locale: cookieLocale, source: "cookie" };

  // For your requirement: default based on country/IP first.
  const byCountry = localeFromCountry(getClientCountry(req));
  if (byCountry) return { locale: byCountry, source: "country" };

  const byHeader = localeFromAcceptLanguage(req.headers.get("accept-language"));
  if (byHeader) return { locale: byHeader, source: "accept-language" };

  return { locale: DEFAULT_LOCALE, source: "default" };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals, API, and public files
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const pathLocale = getPathLocale(pathname);
  const country = getClientCountry(req) ?? "unknown";
  const detected = resolveLocale(req);

  // If URL already includes a locale, let it through and persist cookie
  if (pathLocale) {
    const res = NextResponse.next();
    res.cookies.set(LOCALE_COOKIE, pathLocale, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
    res.headers.set("x-client-country", country);
    res.headers.set("x-locale-detected", detected.locale);
    res.headers.set("x-locale-source", detected.source);
    return res;
  }

  // Otherwise redirect to detected locale
  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${detected.locale}` : `/${detected.locale}${pathname}`;

  const res = NextResponse.redirect(url);
  res.headers.set("x-client-country", country);
  res.headers.set("x-locale-detected", detected.locale);
  res.headers.set("x-locale-source", detected.source);
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
