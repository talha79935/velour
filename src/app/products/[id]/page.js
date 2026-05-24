import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetailClient from './ProductDetailClient';

function parseProduct(p) {
  if (!p) return null;
  return {
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes,
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors,
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
  };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const products = await sql`SELECT * FROM "Product" WHERE "id" = ${id}`;
  const product = products[0];
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const products = await sql`SELECT * FROM "Product" WHERE "id" = ${id}`;
  const product = parseProduct(products[0]);
  if (!product) notFound();

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-height)', paddingBottom: '80px' }}>
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  );
}
