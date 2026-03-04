# Next.js IP/Country Locale Demo

Single-page Next.js app that:
- Redirects `/` (and any non-locale path) to `/<locale>` in **middleware**
- Picks the default locale based on **country** (from Vercel geo / IP country headers)
- Falls back to `Accept-Language`
- Remembers manual selection via `NEXT_LOCALE` cookie

## Run locally
```bash
npm install
npm run dev
```

> On localhost you usually won't get country headers, so it will mostly fall back to `Accept-Language`.

## Deploy to Vercel
Push this folder to GitHub and import in Vercel, or upload as a project.

Then open the deployed URL from different countries / VPN locations to verify the default locale changes.

## Supported locales
en, es, ar, de, tr, pl

## Files to look at
- `middleware.ts` (country/IP detection + redirect)
- `app/[locale]/page.tsx` (single page UI + debug info)
