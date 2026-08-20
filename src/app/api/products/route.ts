import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';

// Force dynamic execution so this route runs on the persistent Node server
// on every request, rather than being cached at build time.
export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({
    count: products.length,
    servedAt: new Date().toISOString(),
    products,
  });
}
