import { sql } from '@/lib/db';
import AdminLayout from '../AdminLayout';
import AdminProductsClient from './AdminProductsClient';

export const metadata = { title: 'Manage Products | VELOUR Admin' };

function parseProduct(p) {
  return {
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes,
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors,
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
  };
}

export default async function AdminProductsPage() {
  const productsRaw = await sql`
    SELECT * FROM "Product" ORDER BY "createdAt" DESC
  `;
  const products = productsRaw.map(parseProduct);

  return (
    <AdminLayout>
      <AdminProductsClient products={products} />
    </AdminLayout>
  );
}
