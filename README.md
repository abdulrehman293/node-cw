# Northwind Supply Co. (node-cw)

A small Next.js (App Router) storefront that runs as a **standalone Node server**, built to be deployed on a persistent host like Cloudways Velocity instead of a serverless platform.

It renders a product catalog live on every request and reads from a Postgres database through a single long-lived connection pool. That pool is the point: on a persistent process the connections open once and get reused, which avoids the connection-storm and cold-start problems you hit when the same app runs as serverless functions.

## What happens on deploy

- **No database configured:** the storefront renders a built-in catalog (with images), so it always looks right.
- **Database configured:** on the first request the app automatically creates the `products` table and seeds it, then serves the catalog from Postgres. No manual SQL step.

## Database connection

Set one of these in your host's Environment Variables:

- `DATABASE_URL` = `postgres://user:password@host:5432/dbname`, or
- the separate vars `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

Add `DB_SSL=true` only if your provider requires SSL.

Point the connection at the database directly, not at a serverless pooler.

## Stack

- Next.js 14 (App Router), `output: 'standalone'`
- Postgres via `pg` (pooled connection in `src/lib/db.ts`)
- Product images bundled in `public/products/`

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without a database it uses the built-in catalog.

## Routes

- `/` storefront (server-rendered on each request)
- `/api/products` JSON API that reads from Postgres

## Manual seeding (optional)

`schema.sql` is included if you ever want to create/seed the table by hand. It is not required, the app seeds itself.
