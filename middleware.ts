import { NextRequest, NextResponse } from "next/server";

const SUPPORTED = ["en", "es", "ar", "tr", "pl", "de"] as const;
const DEFAULT = "en";
type Locale = (typeof SUPPORTED)[number];

function isLocale(v: string | undefined): v is Locale {
  return !!v && (SUPPORTED as readonly string[]).includes(v);
}

function pathLocale(pathname: string): Locale | null {
  const seg = pathname.split("/")[1]?.toLowerCase();
  return isLocale(seg) ? seg : null;
}

function getCountry(req: NextRequest): string | null {
  return (
    ((req as any).geo?.country ??
      req.headers.get("x-vercel-ip-country") ??
      req.headers.get("cf-ipcountry") ??
      req.headers.get("x-country-code"))?.toUpperCase() ?? null
  );
}

function localeFromCountry(cc: string | null): Locale | null {
  if (!cc) return null;
  const map: Record<string, Locale> = {
    DE: "de",
    ES: "es",
    TR: "tr",
    PL: "pl",
    SA: "ar",
    AE: "ar",
    EG: "ar",
    QA: "ar",
    KW: "ar",
  };
  return map[cc] ?? null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const current = pathLocale(pathname);
  const cc = getCountry(req);
  const detected = localeFromCountry(cc) ?? DEFAULT;

  const addDebug = (res: NextResponse) => {
    res.headers.set("x-client-country", cc ?? "unknown");
    res.headers.set("x-locale-detected", detected);
    res.headers.set("x-locale-source", cc ? "country" : "default");
    return res;
  };

  if (!current) {
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${detected}` : `/${detected}${pathname}`;
    return addDebug(NextResponse.redirect(url));
  }

  if (current !== detected) {
    const url = req.nextUrl.clone();
    // safer replace first segment only
    url.pathname = `/${detected}${pathname.slice(`/${current}`.length)}`;
    return addDebug(NextResponse.redirect(url));
  }

  return addDebug(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};