import { sql } from '@/lib/db';
import Link from 'next/link';
import AdminLayout from './AdminLayout';
import { Package, ShoppingCart, Users, TrendingUp, Plus, Eye, Edit } from 'lucide-react';
import styles from './admin.module.css';

export const metadata = { title: 'Admin Dashboard | VELOUR' };

function parseProduct(p) {
  return {
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes,
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors,
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
  };
}

export default async function AdminPage() {
  const [productCountResult, orderCountResult, recentProductsRaw, recentOrders, revenueResult, customerCountResult] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM "Product"`,
    sql`SELECT COUNT(*) as count FROM "Order"`,
    sql`SELECT * FROM "Product" ORDER BY "createdAt" DESC LIMIT 5`,
    sql`SELECT * FROM "Order" ORDER BY "createdAt" DESC LIMIT 5`,
    sql`SELECT COALESCE(SUM("total"), 0) as total FROM "Order"`,
    sql`SELECT COUNT(*) as count FROM "User" WHERE "role" = 'CUSTOMER'`,
  ]);

  const totalProducts = parseInt(productCountResult[0]?.count || 0);
  const totalOrders = parseInt(orderCountResult[0]?.count || 0);
  const recentProducts = recentProductsRaw.map(parseProduct);
  const revenue = parseFloat(revenueResult[0]?.total || 0);
  const customerCount = parseInt(customerCountResult[0]?.count || 0);

  const stats = [
    { icon: Package, label: 'Total Products', value: totalProducts, color: '#c9a84c', href: '/admin/products' },
    { icon: ShoppingCart, label: 'Total Orders', value: totalOrders, color: '#4caf6e', href: '/admin/orders' },
    { icon: TrendingUp, label: 'Total Revenue', value: `PKR ${revenue.toLocaleString()}`, color: '#e8a84c', href: '/admin/orders' },
    { icon: Users, label: 'Customers', value: customerCount, color: '#4ca8cf', href: '#' },
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
