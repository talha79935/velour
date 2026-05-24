import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AdminLayout from '../../../AdminLayout';
import ProductForm from '../../ProductForm';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  return { title: `Edit ${product?.name || 'Product'} | VELOUR Admin` };
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <AdminLayout>
      <ProductForm product={product} />
    </AdminLayout>
  );
}
