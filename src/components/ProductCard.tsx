import type { Product } from '@/lib/products';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card">
      <div className="thumb">
        {/* Plain img keeps this working under the standalone Node server
            without Next's image optimizer. The URL comes from the DB. */}
        <img src={product.image_url} alt={product.name} loading="lazy" />
      </div>
      <span className="card-cat">{product.category}</span>
      <span className="card-name">{product.name}</span>
      <span className="card-desc">{product.description}</span>
      <div className="card-foot">
        <span className="price">${product.price.toFixed(2)}</span>
        <span className={`stock ${product.in_stock ? 'in' : 'out'}`}>
          {product.in_stock ? 'In stock' : 'Sold out'}
        </span>
      </div>
    </div>
  );
}
