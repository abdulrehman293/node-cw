import { Pool, QueryResultRow } from 'pg';

// Build a connection config from whatever the host provides.
// Supports a single DATABASE_URL, or separate DB_* variables (some managed
// hosts inject those instead). Returns null when nothing is configured, so
// the app can fall back to its built-in sample catalog.
function resolveConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    };
  }

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (DB_HOST && DB_USER && DB_NAME) {
    return {
      host: DB_HOST,
      port: Number(DB_PORT ?? 5432),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    };
  }

  return null;
}

export function hasDatabase(): boolean {
  return resolveConfig() !== null;
}

// One long-lived pool, reused across requests on the persistent Node process.
declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

const config = resolveConfig();

const pool =
  global.pgPool ??
  (config
    ? new Pool({
        ...config,
        max: 10,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
      })
    : undefined);

if (process.env.NODE_ENV !== 'production' && pool) {
  global.pgPool = pool;
}

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  if (!pool) {
    throw new Error('No database configured');
  }
  return pool.query<T>(text, params as unknown[] as never[]);
}

export default pool;
