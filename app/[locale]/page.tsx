import { headers } from "next/headers";
import Link from "next/link";
import { MESSAGES } from "../messages";

const SUPPORTED_LOCALES = ["en", "es", "ar", "tr", "pl", "de"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export default async function Page({ params }: { params: { locale: string } }) {
  const rawLocale = params.locale;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";

  const h = headers();

  const country = h.get("x-client-country") || "unknown";
  const detectedLocale = h.get("x-locale-detected") || "n/a";
  const detectedSource = h.get("x-locale-source") || "n/a";

  const t = MESSAGES[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <main className="card" dir={dir}>
      <div style={{ marginBottom: 8 }}>
        <span className="badge">
          route locale: <b>{locale}</b>
        </span>
        <span className="badge">
          country: <b>{country}</b>
        </span>
        <span className="badge">
          detected: <b>{detectedLocale}</b> ({detectedSource})
        </span>
      </div>

      <h1 style={{ marginTop: 0 }}>{t.title}</h1>
      <p>{t.subtitle}</p>

      <h3>{t.choose}</h3>
      <div className="row">
        {SUPPORTED_LOCALES.map((l) => (
          <Link key={l} className="btn" href={`/${l}`}>
            {l.toUpperCase()}
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 14 }}>
        <small>{t.note}</small>
      </p>
    </main>
  );
}