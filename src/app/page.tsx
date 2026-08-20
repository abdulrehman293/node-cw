import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/products';

// Render on every request so product/stock data is always live,
// served by the persistent Node process rather than cached at build.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getProducts();
  const servedAt = new Date().toLocaleTimeString();

  return (
    <>
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark" />
          <span>Northwind Supply Co.</span>
        </div>
        <div className="nav-links">
          <span>Catalog</span>
          <span>Deals</span>
          <span>Account</span>
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <span className="pill">● Live on Cloudways Velocity</span>
          <h1>Gear for a better desk.</h1>
          <p>
            A small storefront running as a standalone Next.js Node server. Every
            page and API response is rendered live on a persistent process, so
            there are no cold starts between you and the catalog.
          </p>
        </section>

        <div className="section-head">
          <h2>Featured products</h2>
          <span className="muted">{products.length} items · rendered {servedAt}</span>
        </div>

        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="footer">
          <span>© {new Date().getFullYear()} Northwind Supply Co.</span>
          <span>Persistent Node.js · Postgres connection pool</span>
        </div>
      </main>
    </>
  );
}
