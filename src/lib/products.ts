import { query, hasDatabase } from './db';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  in_stock: boolean;
  image_url: string;
};

// Built-in catalog. Used as-is when no database is configured, and also used
// to seed the products table the first time the app connects to Postgres.
const SAMPLE_PRODUCTS: Omit<Product, 'id'>[] = [
  { name: 'Aurora Wireless Headphones', description: 'Active noise cancelling, 40h battery.', price: 189.0, category: 'Audio', in_stock: true, image_url: '/products/aurora-headphones.svg' },
  { name: 'Nimbus Mechanical Keyboard', description: 'Hot-swappable switches, aluminum frame.', price: 145.0, category: 'Desk', in_stock: true, image_url: '/products/nimbus-keyboard.svg' },
  { name: 'Lumen 4K Monitor 27"', description: 'Factory-calibrated IPS panel, USB-C 90W.', price: 429.0, category: 'Displays', in_stock: true, image_url: '/products/lumen-monitor.svg' },
  { name: 'Drift Ergonomic Mouse', description: 'Vertical grip, silent clicks, 6 buttons.', price: 59.0, category: 'Desk', in_stock: false, image_url: '/products/drift-mouse.svg' },
  { name: 'Halo Desk Lamp', description: 'Dimmable warm-to-cool, wireless charging base.', price: 78.0, category: 'Desk', in_stock: true, image_url: '/products/halo-lamp.svg' },
  { name: 'Cobalt USB-C Dock', description: '11-in-1 hub, dual 4K output, GbE.', price: 112.0, category: 'Accessories', in_stock: true, image_url: '/products/cobalt-dock.svg' },
];

function sampleWithIds(): Product[] {
  return SAMPLE_PRODUCTS.map((p, i) => ({ id: i + 1, ...p }));
}

// Runs once per process. Creates the table if needed and seeds it when empty,
// so a fresh deploy becomes DB-driven with no manual SQL step.
let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      try {
        await query(`
          CREATE TABLE IF NOT EXISTS products (
            id          SERIAL PRIMARY KEY,
            name        TEXT NOT NULL,
            description TEXT NOT NULL,
            price       NUMERIC(10, 2) NOT NULL,
            category    TEXT NOT NULL,
            in_stock    BOOLEAN NOT NULL DEFAULT true,
            image_url   TEXT NOT NULL DEFAULT ''
          );
        `);
        await query(
          `ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT '';`
        );

        const countRes = await query<{ count: string }>(
          'SELECT COUNT(*)::int AS count FROM products'
        );
        const count = Number(countRes.rows[0]?.count ?? 0);

        if (count === 0) {
          for (const p of SAMPLE_PRODUCTS) {
            await query(
              `INSERT INTO products (name, description, price, category, in_stock, image_url)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [p.name, p.description, p.price, p.category, p.in_stock, p.image_url]
            );
          }
        }
      } catch (err) {
        // Allow a later request to retry instead of caching the failure.
        schemaReady = null;
        throw err;
      }
    })();
  }
  return schemaReady;
}

export async function getProducts(): Promise<Product[]> {
  if (!hasDatabase()) {
    return sampleWithIds();
  }

  try {
    await ensureSchema();
    const result = await query(
      'SELECT id, name, description, price, category, in_stock, image_url FROM products ORDER BY id ASC'
    );
    const rows = result.rows.map((r) => ({
      id: Number(r.id),
      name: String(r.name),
      description: String(r.description),
      price: Number(r.price),
      category: String(r.category),
      in_stock: Boolean(r.in_stock),
      image_url: String(r.image_url),
    })) as Product[];
    return rows.length ? rows : sampleWithIds();
  } catch (err) {
    console.error('DB unavailable, serving sample catalog:', err);
    return sampleWithIds();
  }
}
