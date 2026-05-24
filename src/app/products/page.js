import { sql } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductsClient from './ProductsClient';

export const metadata = {
  title: 'Shop All Products',
  description: 'Browse VELOUR\'s full collection of handcrafted shoes and premium clothing.',
};

function parseProduct(p) {
  return {
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes,
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors,
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
  };
}

async function getProducts(searchParams) {
  const category = searchParams?.category;
  const filter = searchParams?.filter;
  const q = searchParams?.q;

  let products;
  
  if (category && filter === 'new') {
    products = await sql`
      SELECT * FROM "Product" 
      WHERE "status" = 'ACTIVE' AND "category" = ${category} AND "isNew" = true
      ORDER BY "createdAt" DESC
    `;
  } else if (category && filter === 'featured') {
    products = await sql`
      SELECT * FROM "Product" 
      WHERE "status" = 'ACTIVE' AND "category" = ${category} AND "featured" = true
      ORDER BY "createdAt" DESC
    `;
  } else if (category) {
    products = await sql`
      SELECT * FROM "Product" 
      WHERE "status" = 'ACTIVE' AND "category" = ${category}
      ORDER BY "createdAt" DESC
    `;
  } else if (filter === 'new') {
    products = await sql`
      SELECT * FROM "Product" 
      WHERE "status" = 'ACTIVE' AND "isNew" = true
      ORDER BY "createdAt" DESC
    `;
  } else if (filter === 'featured') {
    products = await sql`
      SELECT * FROM "Product" 
      WHERE "status" = 'ACTIVE' AND "featured" = true
      ORDER BY "createdAt" DESC
    `;
  } else if (q) {
    const searchTerm = `%${q}%`;
    products = await sql`
      SELECT * FROM "Product" 
      WHERE "status" = 'ACTIVE' AND (
        "name" ILIKE ${searchTerm} OR 
        "description" ILIKE ${searchTerm} OR
        "tags" ILIKE ${searchTerm}
      )
      ORDER BY "createdAt" DESC
    `;
  } else {
    products = await sql`
      SELECT * FROM "Product" 
      WHERE "status" = 'ACTIVE'
      ORDER BY "createdAt" DESC
    `;
  }

  return products.map(parseProduct);
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const products = await getProducts(params);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <ProductsClient products={products} searchParams={params} />
      </main>
      <Footer />
    </>
  );
}
