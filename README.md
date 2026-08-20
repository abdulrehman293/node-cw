# Northwind Supply Co. (node-cw)

A small Next.js (App Router) storefront that runs as a **standalone Node server**, built to be deployed on a persistent host like Cloudways Velocity instead of a serverless platform.

It renders a product catalog live on every request and reads from a Postgres database through a single long-lived connection pool. That pool is the whole point: on a persistent process the connections are opened once and reused, which avoids the connection-storm and cold-start problems you hit when the same app runs as serverless functions.

## Stack

- Next.js 14 (App Router), `output: 'standalone'`
- Postgres via `pg` (pooled connection in `src/lib/db.ts`)
- No external connection pooler required

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in DATABASE_URL
npm run dev
```

Open http://localhost:3000.

If `DATABASE_URL` is not set, the storefront falls back to a built-in sample catalog so it still renders.

## Database

```bash
psql "$DATABASE_URL" -f schema.sql
```

## Production build

```bash
npm run build
npm start
```

`npm start` runs the standalone server generated at `.next/standalone/server.js`.

## Routes

- `/` — storefront (server-rendered on each request)
- `/api/products` — JSON API that reads from Postgres
