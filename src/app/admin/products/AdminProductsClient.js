'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Edit, Eye, Trash2, Search, Filter, RefreshCcw } from 'lucide-react';
import styles from './products.module.css';

export default function AdminProductsClient({ products: initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete product');
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1>Products</h1>
          <p>{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          <Plus size={16} /> Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            id="admin-product-search"
          />
        </div>
        <div className={styles.filterGroup}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-input"
            id="admin-category-filter"
          >
            <option value="all">All Categories</option>
            <option value="shoes">Shoes</option>
            <option value="clothing">Clothing</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            id="admin-status-filter"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Featured</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className={styles.productCell}>
                    <div className={styles.productThumb}>
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="48px"
                        />
                      ) : (
                        <div className={styles.thumbPlaceholder}>📦</div>
                      )}
                    </div>
                    <div>
                      <p className={styles.productName}>{p.name}</p>
                      <p className={styles.productId}>ID: {p.id.slice(-8)}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.catBadge}>{p.category}</span>
                </td>
                <td>
                  <div>
                    <p className={styles.price}>PKR {p.price.toLocaleString()}</p>
                    {p.comparePrice && (
                      <p className={styles.comparePrice}>PKR {p.comparePrice.toLocaleString()}</p>
                    )}
                  </div>
                </td>
                <td>
                  <span className={p.stock < 20 ? styles.lowStock : styles.inStock}>
                    {p.stock}
                  </span>
                </td>
                <td>
                  <span className={`${styles.status} ${
                    p.status === 'ACTIVE' ? styles.active :
                    p.status === 'DRAFT' ? styles.draft : styles.archived
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <span className={p.featured ? styles.featuredYes : styles.featuredNo}>
                    {p.featured ? '★ Yes' : '—'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/products/${p.id}`} className={styles.actionBtn} title="View">
                      <Eye size={14} />
                    </Link>
                    <Link href={`/admin/products/${p.id}/edit`} className={`${styles.actionBtn} ${styles.editBtn}`} title="Edit">
                      <Edit size={14} />
                    </Link>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={deleting === p.id}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <p>No products found matching your filters.</p>
            <button onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); }} className="btn btn-ghost btn-sm">
              <RefreshCcw size={14} /> Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
