# Career OS

Personal career workspace on your Desktop: start with **ATS Google search** (Greenhouse, Lever, Workday, etc.), then grow into applications, tracking, and more.

## Stack (why this)

| Layer | Choice | Notes |
|--------|--------|--------|
| **App** | [Next.js](https://nextjs.org/) 16 (App Router) | File-based routes, server actions when you need them, easy deploy to Vercel later. |
| **UI** | React 19 + [Tailwind CSS](https://tailwindcss.com/) v4 | Fast iteration, no design-system lock-in for v0. |
| **Language** | TypeScript | Safer refactors as the product grows. |
| **Data / auth** | [Supabase](https://supabase.com/) (Postgres + Auth + RLS) | Managed Postgres, row-level security, and auth without running your own API for CRUD. |

Comfortable defaults: one repo, one deploy target, strong typing end-to-end. When you add mobile or a separate API, Supabase still works as the single source of truth.

## Local dev

```bash
cd ~/Desktop/career-os
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Search UI works **without** Supabase; preferences are stored in `localStorage`.

## Supabase

1. Create a project at [supabase.com](https://supabase.com/).
2. **Project Settings → API**: copy `URL` and `anon` `public` key.
3. Copy `.env.example` to `.env.local` and paste values.
4. In the SQL editor (or Supabase CLI), run `supabase/migrations/20250511000000_search_presets.sql`.

That migration adds `search_presets` for **authenticated** users (RLS). Next product steps: Supabase Auth (email or OAuth) + “Save preset” calling a server action with `createServerSupabaseClient()`.

## Repo layout (high level)

- `src/app/` — routes and layout
- `src/components/` — UI (e.g. `JobSearchLauncher`)
- `src/lib/job-search/` — pure query builders (easy to unit test later)
- `src/lib/supabase/` — browser + server clients and session middleware
- `supabase/migrations/` — SQL you can replay on new environments

## Suggested roadmap

1. **Auth** — Supabase Auth + protected `/settings`
2. **Cloud presets** — sync `search_presets` from the launcher
3. **Apply pipeline** — saved jobs, statuses, notes (new tables)
4. **Reminders** — email or push (Edge Functions or external scheduler)

---

Built in `~/Desktop/career-os` so you can open the folder in Cursor and iterate daily.
