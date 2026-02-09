# HypeShelf

A shared movie recommendations hub where people sign in and share their favorite movies in one clean, public shelf.

**Stack:** Next.js (App Router), TailwindCSS, TypeScript, Clerk (auth), Convex (data + backend).

## Setup

1. **Install and run Convex**
   ```bash
   npm install
   npx convex dev
   ```
   - **With a Convex account (cloud):** First time, a browser may open to log in to Convex. Sign in or create an account, then create or link a project. The terminal shows your deployment URL and a link to the [Convex Dashboard](https://dashboard.convex.dev). The command generates `convex/_generated` and writes `NEXT_PUBLIC_CONVEX_URL` into `.env.local`.
   - **Without an account (run Convex locally):** To develop without signing in, use a local deployment so the backend runs on your machine and data is stored under `~/.convex/`:
     ```bash
     npx convex dev --local --once
     ```
     Keep this command running in a separate terminal. It starts a local Convex backend and updates `convex/_generated` and `.env.local`. You can use a [locally running Convex dashboard](https://docs.convex.dev/cli/local-deployments) to inspect data and functions. When you want to deploy to production later, run `npx convex login` to link the project to an account.
   - Use the Convex dashboard (cloud or local) to set environment variables (e.g. Clerk issuer) and to edit data (e.g. set a user’s role to admin).

2. **Clerk**
   - Create an app at [dashboard.clerk.com](https://dashboard.clerk.com).
   - In Clerk Dashboard → Configure → **JWT templates** → **+ Add new template**. Create a template and set its **name** to exactly `convex` (Convex validates by this name).
   - Copy the **Issuer** URL (Configure → API keys → **Frontend API URL**).
   - In Convex Dashboard → your deployment → **Settings** → **Environment Variables**, add:
     - `CLERK_JWT_ISSUER_DOMAIN` = your Clerk Issuer URL (e.g. `https://xxx.clerk.accounts.dev`).
   - In your app `.env.local` add:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `CLERK_SECRET_KEY`
   (Configure → API keys → → API Keys.)

3. **Run the app**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Making the first admin

New users get the **user** role by default. To make someone an **admin**:

1. Have that user sign in once (so they exist in the `users` table).
2. In Convex Dashboard → **Data** → open the `users` table, find their document, and set `role` to `"admin"`.

Alternatively, you can call the `users:setRole` mutation (e.g. from Convex Dashboard → Functions) with their `clerkId` and `role: "admin"` — but only an existing admin can call that, so the first admin must be set manually in the database.

## Scripts

- `npm run dev` — Next.js dev server (Turbopack).
- `npm run build` / `npm run start` — Production build and start.
- `npx convex dev` — Convex dev (run in a separate terminal while developing).
- `npx convex deploy` — Deploy Convex backend.

## Security

- **Auth:** All mutations that modify data require a signed-in user; identity comes from Clerk via JWT.
- **RBAC:** Delete and “Staff Pick” are enforced in Convex: only the author or an admin can delete; only admins can set Staff Pick.
- **Public read:** Only `recommendations.listLatest` is public (read-only), used for the home page. `recommendations.list` requires auth and powers the all-hypes page (filtering, pagination). Writes go through authenticated mutations with role checks.

## Project structure

- `src/app/` — Next.js App Router (layout, home, dashboard, add).
- `src/components/` — Header, RecCard, GenreFilter, ThemeProvider, ConvexClientProvider.
- `convex/` — Schema, auth config, `users` and `recommendations` functions (queries/mutations).
- `convex/_generated/` — Stub API/server until you run `npx convex dev` (then Convex regenerates these).

© 2026 HypeShelf.
