import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductsClient from './ProductsClient';

export const metadata = {
  title: 'Shop All Products',
  description: 'Browse VELOUR\'s full collection of handcrafted shoes and premium clothing.',
};

async function getProducts(searchParams) {
  const category = searchParams?.category;
  const filter = searchParams?.filter;
  const q = searchParams?.q;

  const where = { status: 'ACTIVE' };
  if (category) where.category = category;
  if (filter === 'new') where.isNew = true;
  if (filter === 'featured') where.featured = true;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ];
  }

  return prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
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
