# CaseStrike Demo (Legal)

CS2-inspired case opening demo built with Vue + Vite + Tailwind + Vue Router + Cloudflare Workers + D1.

## Important

- This project is for entertainment/demo use only.
- No real-money gambling.
- Not affiliated with Valve or Counter-Strike.

## Stack

- Vue 3
- Vite
- Tailwind CSS (via `@tailwindcss/vite`)
- Vue Router
- Cloudflare Worker API
- Cloudflare D1 (SQLite)

## Setup

1. Install deps:
   - `npm install`
2. Create a D1 DB and update `wrangler.toml` with your `database_id`.
3. Run migrations:
   - `npx wrangler d1 execute DB --local --file=./worker/schema.sql`
4. Run Worker API:
   - `npx wrangler dev`
5. Copy `.env.example` to `.env` if needed and set:
   - `VITE_API_BASE_URL` (default is `http://127.0.0.1:8787`)
6. Run frontend:
   - `npm run dev`

## Features

- Email/password auth via Worker + D1 sessions.
- User profile in D1 with virtual `balance` + `inventory`.
- Stipend rule:
  - If balance is below `$5`, user gets `+$100` virtual credits every 15 minutes.
- Weighted rarity and wear tables.
- CS2-style rolling strip animation that lands on the selected result.
