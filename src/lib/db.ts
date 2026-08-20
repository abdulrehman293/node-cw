import { Pool } from 'pg';

// A single, long-lived connection pool.
//
// On a persistent Node server this module is evaluated once and the pool
// stays alive for the life of the process, so connections are reused across
// requests. This is exactly what breaks on serverless, where each cold
// container spins up its own pool and hammers Postgres with new connections.
declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

const pool =
  global.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

if (process.env.NODE_ENV !== 'production') {
  global.pgPool = pool;
}

export function query<T = unknown>(text: string, params?: unknown[]) {
  return pool.query<T extends object ? T : never>(text, params as never[]);
}

export default pool;
