import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import AdminLayout from '../../../AdminLayout';
import ProductForm from '../../ProductForm';

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
  return { title: `Edit ${product?.name || 'Product'} | VELOUR Admin` };
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const products = await sql`SELECT * FROM "Product" WHERE "id" = ${id}`;
  const product = parseProduct(products[0]);
  if (!product) notFound();

  return (
    <AdminLayout>
      <ProductForm product={product} />
    </AdminLayout>
  );
}
