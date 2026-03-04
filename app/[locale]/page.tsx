import { headers } from "next/headers";
import Link from "next/link";
import { MESSAGES } from "../messages";

const SUPPORTED_LOCALES = ["en", "es", "ar", "tr", "pl", "de"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const rawLocale = resolvedParams.locale;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";

  const h = await headers();

  const country = h.get("x-client-country") || "unknown";
  const detectedLocale = h.get("x-locale-detected") || "n/a";
  const detectedSource = h.get("x-locale-source") || "n/a";

  const t = MESSAGES[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";
  const cardStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px",
    background: "#ffffff",
  } as const;

  return (
    <main
      dir={dir}
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        display: "grid",
        gap: 14,
      }}
    >
      <section
        style={{
          ...cardStyle,
          background: "linear-gradient(140deg, #fff7ed, #fef3c7)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#b45309",
            fontWeight: 700,
            letterSpacing: "0.08em",
            fontSize: 12,
          }}
        >
          {t.eyebrow}
        </p>
        <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.1, color: "#422006" }}>
          {t.title}
        </h1>
        <p style={{ margin: 0, color: "#78350f", maxWidth: "60ch" }}>{t.subtitle}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          <a
            href="#menu"
            style={{
              display: "inline-block",
              textDecoration: "none",
              border: "1px solid #f59e0b",
              borderRadius: 10,
              padding: "9px 12px",
              fontWeight: 600,
              background: "#f59e0b",
              color: "#ffffff",
            }}
          >
            {t.ctaPrimary}
          </a>
          <a
            href="#about"
            style={{
              display: "inline-block",
              textDecoration: "none",
              border: "1px solid #d6d3d1",
              borderRadius: 10,
              padding: "9px 12px",
              fontWeight: 600,
              background: "#ffffff",
            }}
          >
            {t.ctaSecondary}
          </a>
        </div>
        <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span className="badge" style={{ marginRight: 0, background: "#ffffff" }}>
            locale: <b>{locale.toUpperCase()}</b>
          </span>
          <span className="badge" style={{ marginRight: 0, background: "#ffffff" }}>
            country: <b>{country}</b>
          </span>
          <span className="badge" style={{ marginRight: 0, background: "#ffffff" }}>
            detected: <b>{detectedLocale}</b> ({detectedSource})
          </span>
        </div>
      </section>

      <section
        id="about"
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <article style={cardStyle}>
          <h3 style={{ margin: "0 0 8px", color: "#292524" }}>{t.featureOneTitle}</h3>
          <p style={{ margin: 0, color: "#57534e" }}>{t.featureOneText}</p>
        </article>
        <article style={cardStyle}>
          <h3 style={{ margin: "0 0 8px", color: "#292524" }}>{t.featureTwoTitle}</h3>
          <p style={{ margin: 0, color: "#57534e" }}>{t.featureTwoText}</p>
        </article>
        <article style={cardStyle}>
          <h3 style={{ margin: "0 0 8px", color: "#292524" }}>{t.featureThreeTitle}</h3>
          <p style={{ margin: 0, color: "#57534e" }}>{t.featureThreeText}</p>
        </article>
      </section>

      <section
        id="menu"
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <article style={cardStyle}>
          <h4 style={{ margin: "0 0 8px", color: "#292524" }}>{t.menuOneTitle}</h4>
          <p style={{ margin: 0, color: "#57534e" }}>{t.menuOneText}</p>
          <span style={{ display: "inline-block", marginTop: 12, color: "#b45309", fontWeight: 700 }}>{t.menuOnePrice}</span>
        </article>
        <article style={cardStyle}>
          <h4 style={{ margin: "0 0 8px", color: "#292524" }}>{t.menuTwoTitle}</h4>
          <p style={{ margin: 0, color: "#57534e" }}>{t.menuTwoText}</p>
          <span style={{ display: "inline-block", marginTop: 12, color: "#b45309", fontWeight: 700 }}>{t.menuTwoPrice}</span>
        </article>
        <article style={cardStyle}>
          <h4 style={{ margin: "0 0 8px", color: "#292524" }}>{t.menuThreeTitle}</h4>
          <p style={{ margin: 0, color: "#57534e" }}>{t.menuThreeText}</p>
          <span style={{ display: "inline-block", marginTop: 12, color: "#b45309", fontWeight: 700 }}>{t.menuThreePrice}</span>
        </article>
      </section>

      <section style={cardStyle}>
        <h3 style={{ margin: 0 }}>{t.choose}</h3>
        <div className="row">
          {SUPPORTED_LOCALES.map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              className="btn"
              style={{
                borderColor: locale === l ? "#f59e0b" : "#d6d3d1",
                background: locale === l ? "#fffbeb" : "#ffffff",
              }}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
        <p style={{ marginTop: 12, color: "#57534e" }}>{t.note}</p>
      </section>

      <section style={cardStyle}>
        <p style={{ margin: "0 0 6px", fontSize: 18, color: "#422006" }}>{t.reviewQuote}</p>
        <small style={{ color: "#92400e", fontWeight: 600 }}>{t.brand}</small>
      </section>
    </main>
  );
}
