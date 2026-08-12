# UNSW Bengaluru Club Management Portal

A full-stack portal for discovering clubs, applying to join as a Member or
Executive, and proposing brand-new clubs — built with Next.js 14, Supabase
(Postgres), Prisma, and NextAuth.js Google sign-in.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Database | Supabase Postgres |
| ORM | Prisma (`User`, `Club`, `Membership`, `ClubRegistration`) |
| Auth | NextAuth.js — Google OAuth |
| Styling | Tailwind CSS, UNSW brand palette (`#FFE600` yellow / `#231F20` charcoal) |
| Hosting | Vercel |

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → Database → Connection string**: copy the pooled
   ("Transaction") string into `DATABASE_URL`, and the direct connection into
   `DIRECT_URL` in your `.env` file (Prisma Migrate needs the direct one —
   the pooler doesn't support prepared statements).
3. **Project Settings → API**: copy the Project URL and `anon` public key
   into `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` if
   you'll upload club logos to Supabase Storage.

## 2. Set up Google OAuth

1. In [Google Cloud Console](https://console.cloud.google.com) → **APIs &
   Services → Credentials**, create an **OAuth client ID** (type: Web
   application).
2. Authorized redirect URI:
   `http://localhost:3000/api/auth/callback/google` for local dev, and
   `https://YOUR-DOMAIN/api/auth/callback/google` once deployed.
3. Copy the client ID/secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
4. Optional but recommended: set `ALLOWED_EMAIL_DOMAIN` (e.g.
   `student.unswbengaluru.edu`) so only campus accounts can sign in.

## 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in every value — see inline comments in `.env.example`. Generate
`NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

**Bootstrapping your first admin:** add your own email to `ADMIN_EMAILS`
(comma-separated) *before* you sign in for the first time — the role is
assigned the moment your account is created.

## 4. Install, migrate, seed

```bash
npm install
npm run db:push     # or `npm run db:migrate` if you want tracked migrations
npm run db:seed      # optional — adds 6 sample clubs so the directory isn't empty
npm run dev
```

Visit `http://localhost:3000`.

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel and add every variable from `.env` as a Vercel
   environment variable (Production **and** Preview).
3. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your production URL.
4. Add the production callback URL to the Google OAuth client:
   `https://YOUR-DOMAIN/api/auth/callback/google`.
5. Deploy. `npm run build` already runs `prisma generate`, and
   `postinstall` covers Vercel's cached-`node_modules` case too.

## Project structure

```
prisma/schema.prisma       User, Club, Membership, ClubRegistration
src/lib/auth.ts            NextAuth config — Google provider, role assignment
src/middleware.ts          Route protection for /dashboard, /admin, /clubs/new
src/app/api/…              REST endpoints for clubs, memberships, registrations
src/app/…                  Pages (App Router)
src/components/…           Shared UI
```

### How access control works

- Anyone can browse `/clubs` and read a club's description/category.
- A club's **executive phone and email are hidden** until the viewer has an
  `APPROVED` membership in that specific club, or is an Admin
  (`src/app/api/clubs/[slug]/route.ts` and the matching server component).
- Approving a `ClubRegistration` provisions the `Club` row and grants the
  proposer an `APPROVED` `EXECUTIVE` membership in one transaction, so a
  newly approved club always has an owner.

## Launch checklist coverage

Mapped from the 15-point pre-launch checklist:

| # | Item | Where |
|---|---|---|
| 1 | CTA above the fold | `src/app/page.tsx` hero |
| 2 | FAQs | `/faq` |
| 3 | Response/decision time | Stated on the hero, apply form, and thank-you page ("3–5 business days") |
| 4 | Thank-you page | `/thank-you` |
| 5 | Sticky mobile CTA | `src/components/StickyMobileCTA.tsx` |
| 6 | robots.txt | `src/app/robots.ts` |
| 7 | Meta descriptions | Per-page `metadata.description` |
| 8 | Meta titles | `metadata.title` template in `layout.tsx` |
| 9 | Social sharing image | `src/app/opengraph-image.tsx` (auto-generated) |
| 10 | Maps + directions | `/contact` |
| 11 | Alt text | Every `<Image>` has a descriptive `alt` |
| 12 | Privacy / policy pages | `/privacy`, `/terms` |
| 13 | GA4 | `src/components/GoogleAnalytics.tsx` — set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to enable |
| 14 | USP bar | `src/components/USPBar.tsx` |
| 15 | "DM for bonus" | Not applicable to a club portal — repurposed as a social follow link in the footer |

## Not included (needs your judgment call)

- Club logo/cover image upload UI (the schema and `next.config.mjs` are
  ready for Supabase Storage — wire up an upload input where useful).
- Email notifications on decisions (would slot into the two `PATCH` routes
  in `src/app/api/memberships/[id]` and `.../registrations/[id]`).
- Real privacy/terms copy — what's here is clearly marked as placeholder.
