import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '../AdminLayout';
import AdminProductsClient from './AdminProductsClient';
import styles from '../admin.module.css';

export const metadata = { title: 'Manage Products | VELOUR Admin' };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminLayout>
      <AdminProductsClient products={products} />
    </AdminLayout>
  );
}
