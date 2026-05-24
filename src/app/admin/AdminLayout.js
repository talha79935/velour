'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Plus, ChevronRight, Home } from 'lucide-react';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoV}>V</span>
            <span className={styles.logoText}>ELOUR</span>
          </Link>
          <p className={styles.sidebarLabel}>Admin Portal</p>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                className={`${styles.navItem} ${isActive ? styles.navActive : ''}`}
              >
                <Icon size={18} />
                <span>{label}</span>
                {isActive && <ChevronRight size={14} className={styles.activeArrow} />}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <Link href="/admin/products/new" className={`btn btn-primary ${styles.addBtn}`}>
            <Plus size={16} /> Add Product
          </Link>
          <Link href="/" className={styles.storeFront}>
            <Home size={16} /> View Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        <div className={styles.topBar}>
          <nav className={styles.breadNav}>
            <Link href="/admin">Admin</Link>
            {pathname !== '/admin' && (
              <>
                <ChevronRight size={14} />
                <span>{pathname.split('/').pop()?.replace(/-/g, ' ')}</span>
              </>
            )}
          </nav>
          <div className={styles.topBarRight}>
            <span className={styles.adminBadge}>● ADMIN</span>
            <a href="/api/auth/signout" className={styles.signout}>
              <LogOut size={16} />
            </a>
          </div>
        </div>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
