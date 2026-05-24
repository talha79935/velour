import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AdminLayout from './AdminLayout';
import { Package, ShoppingCart, Users, TrendingUp, Plus, Eye, Edit } from 'lucide-react';
import styles from './admin.module.css';

export const metadata = { title: 'Admin Dashboard | VELOUR' };

export default async function AdminPage() {
  const [totalProducts, totalOrders, recentProducts, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  const revenue = await prisma.order.aggregate({ _sum: { total: true } });

  const stats = [
    { icon: Package, label: 'Total Products', value: totalProducts, color: '#c9a84c', href: '/admin/products' },
    { icon: ShoppingCart, label: 'Total Orders', value: totalOrders, color: '#4caf6e', href: '/admin/orders' },
    { icon: TrendingUp, label: 'Total Revenue', value: `PKR ${(revenue._sum.total || 0).toLocaleString()}`, color: '#e8a84c', href: '/admin/orders' },
    { icon: Users, label: 'Customers', value: await prisma.user.count({ where: { role: 'CUSTOMER' } }), color: '#4ca8cf', href: '#' },
  ];

  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <div className={styles.pageHeader}>
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin. Here&apos;s what&apos;s happening.</p>
          </div>
          <Link href="/admin/products/new" className="btn btn-primary">
            <Plus size={16} /> Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          {stats.map(({ icon: Icon, label, value, color, href }) => (
            <Link key={label} href={href} className={styles.statCard}>
              <div className={styles.statIcon} style={{ background: `${color}20`, color }}>
                <Icon size={22} />
              </div>
              <div>
                <p className={styles.statLabel}>{label}</p>
                <p className={styles.statValue}>{value}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.tables}>
          {/* Recent Products */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h2>Recent Products</h2>
              <Link href="/admin/products" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className={styles.productName}>{p.name}</span>
                    </td>
                    <td><span className={styles.catBadge}>{p.category}</span></td>
                    <td>PKR {p.price.toLocaleString()}</td>
                    <td>
                      <span className={p.stock < 20 ? styles.lowStock : styles.inStock}>{p.stock}</span>
                    </td>
                    <td>
                      <span className={`${styles.status} ${p.status === 'ACTIVE' ? styles.active : styles.draft}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link href={`/products/${p.id}`} className={styles.actionIcon}><Eye size={14} /></Link>
                        <Link href={`/admin/products/${p.id}/edit`} className={styles.actionIcon}><Edit size={14} /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Orders */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h2>Recent Orders</h2>
              <Link href="/admin/orders" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className={styles.noData}>No orders yet.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td><span className={styles.orderId}>#{o.id.slice(-8)}</span></td>
                      <td>{o.guestName || o.guestEmail || 'Customer'}</td>
                      <td>PKR {o.total.toLocaleString()}</td>
                      <td>
                        <span className={`${styles.status} ${o.status === 'DELIVERED' ? styles.active : styles.pending}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
