'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { SlidersHorizontal, Grid2x2, Grid3x3, Search, X } from 'lucide-react';
import styles from './products.module.css';

export default function ProductsClient({ products, searchParams }) {
  const router = useRouter();
  const [gridSize, setGridSize] = useState(4);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const category = searchParams?.category;
  const filter = searchParams?.filter;

  const sorted = useMemo(() => {
    let p = [...products].filter(
      (pr) => pr.price >= priceRange[0] && pr.price <= priceRange[1]
    );
    switch (sortBy) {
      case 'price-asc': return p.sort((a, b) => a.price - b.price);
      case 'price-desc': return p.sort((a, b) => b.price - a.price);
      case 'name': return p.sort((a, b) => a.name.localeCompare(b.name));
      default: return p;
    }
  }, [products, sortBy, priceRange]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const pageTitle =
    filter === 'new' ? 'New Arrivals' :
    filter === 'featured' ? 'Featured Pieces' :
    category === 'shoes' ? 'Footwear' :
    category === 'clothing' ? 'Apparel' :
    'All Products';

  const breadcrumb = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    ...(category || filter ? [{ label: pageTitle }] : []),
  ];

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.header}>
        <div className="container">
          <nav className={styles.breadcrumb}>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className={styles.breadItem}>
                {crumb.href ? (
                  <a href={crumb.href} className={styles.breadLink}>{crumb.label}</a>
                ) : (
                  <span className={styles.breadCurrent}>{crumb.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span className={styles.breadSep}>/</span>}
              </span>
            ))}
          </nav>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          <p className={styles.pageSubtitle}>{sorted.length} handcrafted {sorted.length === 1 ? 'piece' : 'pieces'}</p>
        </div>
      </div>

      <div className="container">
        {/* Toolbar */}
        <div className={styles.toolbar}>
          {/* Category Tabs */}
          <div className={styles.tabs}>
            {[
              { label: 'All', href: '/products' },
              { label: 'Shoes', href: '/products?category=shoes' },
              { label: 'Clothing', href: '/products?category=clothing' },
              { label: 'New', href: '/products?filter=new' },
              { label: 'Featured', href: '/products?filter=featured' },
            ].map((tab) => {
              const isActive =
                (!category && !filter && tab.label === 'All') ||
                (category === 'shoes' && tab.label === 'Shoes') ||
                (category === 'clothing' && tab.label === 'Clothing') ||
                (filter === 'new' && tab.label === 'New') ||
                (filter === 'featured' && tab.label === 'Featured');
              return (
                <a
                  key={tab.label}
                  href={tab.href}
                  className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                >
                  {tab.label}
                </a>
              );
            })}
          </div>

          <div className={styles.toolbarRight}>
            <select
              className={`${styles.select} form-input`}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="products-sort"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>

            <div className={styles.gridToggles}>
              <button
                className={`${styles.gridBtn} ${gridSize === 3 ? styles.gridActive : ''}`}
                onClick={() => setGridSize(3)}
                aria-label="3 columns"
              >
                <Grid3x3 size={16} />
              </button>
              <button
                className={`${styles.gridBtn} ${gridSize === 4 ? styles.gridActive : ''}`}
                onClick={() => setGridSize(4)}
                aria-label="4 columns"
              >
                <Grid2x2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sorted.length > 0 ? (
          <div
            className={styles.grid}
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {sorted.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => showToast(`${product.name} added to cart!`)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛍️</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or browse all products.</p>
            <a href="/products" className="btn btn-outline">View All Products</a>
          </div>
        )}
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="toast-container">
          <div className="toast toast-success">
            <span>✓</span> {toastMsg}
          </div>
        </div>
      )}
    </div>
  );
}
