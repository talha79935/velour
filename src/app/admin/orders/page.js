import { prisma } from '@/lib/prisma';
import AdminLayout from '../AdminLayout';
import styles from '../admin.module.css';

export const metadata = { title: 'Orders | VELOUR Admin' };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const statusColors = {
    PENDING: 'pending',
    PROCESSING: 'pending',
    SHIPPED: 'shipped',
    DELIVERED: 'active',
    CANCELLED: 'archived',
  };

  return (
    <AdminLayout>
      <div>
        <div className={styles.pageHeader}>
          <div>
            <h1>Orders</h1>
            <p>{orders.length} total orders</p>
          </div>
        </div>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '48px' }}>
                    No orders yet. When customers buy, they appear here.
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id}>
                  <td><span className={styles.orderId}>#{order.id.slice(-8)}</span></td>
                  <td>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>
                        {order.guestName || 'Customer'}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.guestEmail}</p>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {order.items.map((item) => (
                        <div key={item.id}>{item.product.name} ×{item.quantity}</div>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    PKR {order.total.toLocaleString()}
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[statusColors[order.status] || 'pending']}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-PK', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
