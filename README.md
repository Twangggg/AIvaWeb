# AIvaWeb Base

Base stack:
- Next.js (App Router) + TypeScript strict
- Tailwind CSS
- React Query
- React Hook Form + Zod
- Supabase (no backend required)
- ESLint + Prettier + Husky + lint-staged
- GitHub Actions CI

## Quick start

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Connect to your Supabase project

Project (your link): `mhounayqkngnzlgzlsmv`

1. Open Supabase Dashboard:
   - `Settings` -> `API`
2. Copy values:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Put into `.env.local`.
4. Open `SQL Editor` and run file:
   - `supabase/setup_preorders.sql`
5. Restart app:

```bash
npm run dev
```

## Verify connection on web

1. Submit pre-order form on homepage.
2. Open Supabase `Table Editor` -> `preorders`.
3. You should see a new row.

## Commands

- `npm run dev`: local dev
- `npm run lint`: lint code
- `npm run typecheck`: TypeScript check
- `npm run build`: production build
- `npm run format`: format project
