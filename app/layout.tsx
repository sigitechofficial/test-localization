import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IP Locale Demo (Next.js)",
  description: "Locale auto-detected from country (Vercel geo/IP headers) with a middleware redirect.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
