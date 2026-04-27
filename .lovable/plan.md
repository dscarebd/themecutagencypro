## Goal

Make the build output a single, flat `dist/` folder containing only static files (`index.html`, `assets/`, images, `.htaccess`) — no `client/` and no `server/` subfolders — so you can upload everything inside `dist/` directly into `public_html` and the site will run completely.

## Why the current build creates `client/` + `server/`

Your project is built on **TanStack Start**, which is a full-stack SSR framework. The build emits two folders because it needs both:
- `client/` → browser code
- `server/` → Node/Worker code that runs SSR, server functions, and the admin panel

Shared hosting like Hostinger `public_html` **cannot run the `server/` folder** — it only serves static files. So as long as TanStack Start (SSR) is in use, the build will always be split, and uploading only `client/` to `public_html` will break the dynamic features (admin save, team data from database, etc.).

To get a single static `dist/` folder, the app must be migrated off TanStack Start onto a plain Vite + React SPA.

## What changes (and what you lose)

**You will lose** (because there is no server on shared hosting):
- `/admin` page that edits team members and uploads photos to the database
- Live database-driven team data — team profiles will be hardcoded in `src/lib/site-data.ts` (the existing `fallbackTeam` already there)
- Database image uploads — to add/edit team members later, you'll need to edit code & re-upload `dist/`
- SSR (server-side rendering). SEO meta tags will still work via React Helmet on the client, but initial HTML will be a blank shell until JS loads.

**You keep**:
- All pages: Home, Services, Projects, Team list, Team profile (`/team/:slug`), Contact
- All styling, layout, animations
- Per-page meta tags / OG tags (via react-helmet-async)
- `themecutagency.pro` domain — but DNS must point to wherever you upload the files

## Migration plan (what I will do in default mode)

### 1. Replace the framework
- Remove TanStack Start packages: `@tanstack/react-start`, `@tanstack/router-plugin`, `@cloudflare/vite-plugin`, `@lovable.dev/vite-tanstack-config`, `wrangler.jsonc`
- Add plain Vite SPA setup with `@vitejs/plugin-react` and `react-router-dom` v6
- Add `react-helmet-async` for per-page `<title>` / OG meta

### 2. Rewrite `vite.config.ts`
- Plain Vite config: `base: './'`, `build.outDir: 'dist'`, `build.assetsDir: 'assets'`
- Output is a flat `dist/` containing `index.html`, `assets/...`, copied images — no `client/`, no `server/`

### 3. Rewrite routing (file-based → react-router-dom)
- New `src/main.tsx` → ReactDOM root + `<BrowserRouter>` + `<HelmetProvider>`
- New `src/App.tsx` with `<Routes>`:
  - `/` → Home (current `routes/index.tsx` content)
  - `/services` → Services
  - `/projects` → Projects
  - `/team` → Team list (uses static `fallbackTeam`)
  - `/team/:slug` → Profile (lookup in static `fallbackTeam`)
  - `/contact` → Contact
  - `*` → 404
- Convert each `routes/*.tsx` page into a plain component under `src/pages/`
- Replace `<Link to="...">` (TanStack) with `<Link to="...">` (react-router-dom) — same names, different import
- Replace each route's `head: () => ({ meta: [...] })` with `<Helmet>` tags inside the component
- Delete `src/routeTree.gen.ts`, `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/`

### 4. Remove all server code
- Delete `src/lib/team.functions.ts` (server functions)
- Delete `src/integrations/supabase/client.server.ts` and `src/integrations/supabase/auth-middleware.ts`
- Delete `src/routes/admin.tsx` (admin panel — cannot run without server)
- Delete `supabase/` folder (migrations no longer used by the app — your existing database stays untouched on the backend, just no longer read by the static site)

### 5. Hardcode team data
- The `Team` and `Profile` pages will read from the existing `fallbackTeam` array in `src/lib/site-data.ts`
- To edit team members later, you edit `site-data.ts` in the codebase, rebuild, and re-upload `dist/`

### 6. SPA routing for `public_html`
- Add `public/.htaccess` with the existing rewrite rules (already present) so deep links like `/team/maya-chen` work after refresh on Apache (Hostinger uses Apache)
- Add `public/_redirects` (`/* /index.html 200`) as a fallback for non-Apache hosts

### 7. New build script
- `npm run build` will produce a single flat `dist/` folder
- Upload the **contents** of `dist/` (not the folder itself) into `public_html`

## After deploy — DNS for `themecutagency.pro`

If you upload to Hostinger `public_html`, point `themecutagency.pro` to **Hostinger's** servers (in your Hostinger DNS panel: A record `@` and `www` → Hostinger hosting IP, which Hostinger shows you in hPanel). Do NOT point to Lovable's IP `185.158.133.1` anymore — that was for the Lovable-hosted version.

## Confirmation needed before I proceed

This is a **destructive migration** — the admin panel and database-driven team editing will be permanently removed from the codebase. The current Lovable-hosted version at `themecutagency.pro` will also stop working in its current dynamic form once these changes are applied (it will become the same static version).

If that's OK, approve this plan and I'll execute the migration.