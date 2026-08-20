import { query } from './db';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  in_stock: boolean;
};

// Fallback catalog. Used when DATABASE_URL is not set yet, so the storefront
// still renders on first deploy before the products table is seeded.
const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, name: 'Aurora Wireless Headphones', description: 'Active noise cancelling, 40h battery.', price: 189.0, category: 'Audio', in_stock: true },
  { id: 2, name: 'Nimbus Mechanical Keyboard', description: 'Hot-swappable switches, aluminum frame.', price: 145.0, category: 'Desk', in_stock: true },
  { id: 3, name: 'Lumen 4K Monitor 27"', description: 'Factory-calibrated IPS panel, USB-C 90W.', price: 429.0, category: 'Displays', in_stock: true },
  { id: 4, name: 'Drift Ergonomic Mouse', description: 'Vertical grip, silent clicks, 6 buttons.', price: 59.0, category: 'Desk', in_stock: false },
  { id: 5, name: 'Halo Desk Lamp', description: 'Dimmable warm-to-cool, wireless charging base.', price: 78.0, category: 'Desk', in_stock: true },
  { id: 6, name: 'Cobalt USB-C Dock', description: '11-in-1 hub, dual 4K output, GbE.', price: 112.0, category: 'Accessories', in_stock: true },
];

export async function getProducts(): Promise<Product[]> {
  if (!process.env.DATABASE_URL) {
    return SAMPLE_PRODUCTS;
  }

  try {
    const result = await query<Product>(
      'SELECT id, name, description, price, category, in_stock FROM products ORDER BY id ASC'
    );
    return (result.rows as Product[]).length ? (result.rows as Product[]) : SAMPLE_PRODUCTS;
  } catch (err) {
    console.error('DB query failed, serving sample catalog:', err);
    return SAMPLE_PRODUCTS;
  }
}
