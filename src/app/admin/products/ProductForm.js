'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImageIcon, Loader2, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './ProductForm.module.css';

const PLACEHOLDER_IMAGES = [
  '/products/sneaker-black-gold.png',
  '/products/loafer-burgundy.png',
  '/products/sneaker-white.png',
  '/products/hoodie-charcoal.png',
  '/products/bomber-navy.png',
  '/products/tshirt-black.png',
  '/products/cargo-grey.png',
];

export default function ProductForm({ product }) {
  const router = useRouter();
  const isEditing = !!product;

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    imageUrl: product?.imageUrl || '',
    category: product?.category || 'shoes',
    subcategory: product?.subcategory || '',
    sizes: product?.sizes ? JSON.parse(product.sizes).join(', ') : '',
    colors: product?.colors ? JSON.parse(product.colors).join(', ') : '',
    tags: product?.tags ? JSON.parse(product.tags).join(', ') : '',
    stock: product?.stock || 100,
    featured: product?.featured || false,
    isNew: product?.isNew !== undefined ? product.isNew : true,
    status: product?.status || 'ACTIVE',
  });

  const [imagePreview, setImagePreview] = useState(product?.imageUrl || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [showPlaceholders, setShowPlaceholders] = useState(false);

  const updateField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (key === 'imageUrl') setImagePreview(val);
  };

  const selectPlaceholder = (url) => {
    updateField('imageUrl', url);
    setShowPlaceholders(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const body = {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock),
        sizes: JSON.stringify(form.sizes.split(',').map((s) => s.trim()).filter(Boolean)),
        colors: JSON.stringify(form.colors.split(',').map((s) => s.trim()).filter(Boolean)),
        tags: JSON.stringify(form.tags.split(',').map((s) => s.trim()).filter(Boolean)),
        images: JSON.stringify([form.imageUrl].filter(Boolean)),
      };

      const url = isEditing ? `/api/products/${product.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      setSaved(true);
      setTimeout(() => {
        router.push('/admin/products');
        router.refresh();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHeader}>
        <div>
          <Link href="/admin/products" className={styles.back}>
            <ArrowLeft size={16} /> Back to Products
          </Link>
          <h1>{isEditing ? `Edit: ${product.name}` : 'Add New Product'}</h1>
        </div>
        <button
          type="submit"
          className={`btn btn-primary ${saved ? 'btn-success' : ''}`}
          disabled={saving || saved}
          id="save-product-btn"
        >
          {saved ? <><Check size={16} /> Saved!</> :
           saving ? <><Loader2 size={16} className={styles.spin} /> Saving...</> :
           'Save Product'}
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          ⚠️ {error}
        </div>
      )}

      <div className={styles.grid}>
        {/* Main Details */}
        <div className={styles.mainCol}>
          <div className={styles.section}>
            <h2>Product Details</h2>
            <div className={styles.fieldGroup}>
              <div className="form-group">
                <label className="form-label" htmlFor="prod-name">Product Name *</label>
                <input
                  id="prod-name"
                  type="text"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g. Noir Eclipse High-Top"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="prod-desc">Description *</label>
                <textarea
                  id="prod-desc"
                  className={`form-input ${styles.textarea}`}
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe the product in detail..."
                  required
                  rows={5}
                />
              </div>
            </div>
          </div>

          {/* Image — KEY FEATURE */}
          <div className={styles.section}>
            <h2>Product Image</h2>
            <p className={styles.sectionNote}>
              Enter an image URL to swap the product image. You can use placeholder images or any remote URL.
            </p>
            
            <div className={styles.imageSection}>
              {/* Preview */}
              {imagePreview ? (
                <div className={styles.imagePreview}>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="300px"
                    onError={() => setImagePreview('')}
                  />
                  <button
                    type="button"
                    className={styles.clearImage}
                    onClick={() => { setImagePreview(''); updateField('imageUrl', ''); }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className={styles.imagePlaceholder}>
                  <ImageIcon size={40} />
                  <p>No image selected</p>
                </div>
              )}

              <div className={styles.imageControls}>
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-image">Image URL</label>
                  <input
                    id="prod-image"
                    type="text"
                    className="form-input"
                    value={form.imageUrl}
                    onChange={(e) => { updateField('imageUrl', e.target.value); setImagePreview(e.target.value); }}
                    placeholder="https://... or /products/..."
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowPlaceholders(!showPlaceholders)}
                >
                  <ImageIcon size={14} /> {showPlaceholders ? 'Hide' : 'Choose'} Placeholder
                </button>

                {showPlaceholders && (
                  <div className={styles.placeholders}>
                    <p className={styles.placeholderNote}>Select from AI-generated product images:</p>
                    <div className={styles.placeholderGrid}>
                      {PLACEHOLDER_IMAGES.map((img) => (
                        <button
                          key={img}
                          type="button"
                          className={`${styles.placeholderThumb} ${imagePreview === img ? styles.placeholderSelected : ''}`}
                          onClick={() => selectPlaceholder(img)}
                        >
                          <Image src={img} alt={img} fill style={{ objectFit: 'cover' }} sizes="80px" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className={styles.section}>
            <h2>Sizes & Colors</h2>
            <div className={styles.fieldRow}>
              <div className="form-group">
                <label className="form-label" htmlFor="prod-sizes">Sizes (comma-separated)</label>
                <input
                  id="prod-sizes"
                  type="text"
                  className="form-input"
                  value={form.sizes}
                  onChange={(e) => updateField('sizes', e.target.value)}
                  placeholder="XS, S, M, L, XL or 38, 39, 40..."
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="prod-colors">Colors (comma-separated)</label>
                <input
                  id="prod-colors"
                  type="text"
                  className="form-input"
                  value={form.colors}
                  onChange={(e) => updateField('colors', e.target.value)}
                  placeholder="Black/Gold, Jet Black..."
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-tags">Tags (comma-separated)</label>
              <input
                id="prod-tags"
                type="text"
                className="form-input"
                value={form.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="sneakers, leather, gold, featured..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sideCol}>
          {/* Pricing */}
          <div className={styles.section}>
            <h2>Pricing</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-price">Price (PKR) *</label>
              <input
                id="prod-price"
                type="number"
                className="form-input"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="0"
                min="0"
                step="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-compare">Compare Price (PKR)</label>
              <input
                id="prod-compare"
                type="number"
                className="form-input"
                value={form.comparePrice}
                onChange={(e) => updateField('comparePrice', e.target.value)}
                placeholder="0"
                min="0"
                step="1"
              />
              <p className={styles.hint}>Set higher than price to show discount</p>
            </div>
          </div>

          {/* Category */}
          <div className={styles.section}>
            <h2>Organization</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-cat">Category *</label>
              <select
                id="prod-cat"
                className="form-input"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
              >
                <option value="shoes">Shoes</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-subcat">Subcategory</label>
              <input
                id="prod-subcat"
                type="text"
                className="form-input"
                value={form.subcategory}
                onChange={(e) => updateField('subcategory', e.target.value)}
                placeholder="sneakers, hoodies, loafers..."
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-stock">Stock Quantity</label>
              <input
                id="prod-stock"
                type="number"
                className="form-input"
                value={form.stock}
                onChange={(e) => updateField('stock', e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Status */}
          <div className={styles.section}>
            <h2>Status & Visibility</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="prod-status">Status</label>
              <select
                id="prod-status"
                className="form-input"
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
              >
                <option value="ACTIVE">Active — Visible in store</option>
                <option value="DRAFT">Draft — Hidden from store</option>
                <option value="ARCHIVED">Archived — No longer sold</option>
              </select>
            </div>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateField('featured', e.target.checked)}
                  id="prod-featured"
                />
                <span className={styles.checkLabel}>⭐ Featured Product</span>
                <span className={styles.checkNote}>Shows on homepage</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={form.isNew}
                  onChange={(e) => updateField('isNew', e.target.checked)}
                  id="prod-new"
                />
                <span className={styles.checkLabel}>🆕 New Arrival</span>
                <span className={styles.checkNote}>Shows "New" badge</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formFooter}>
        <Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={saving || saved}
        >
          {saved ? '✓ Saved!' :
           saving ? 'Saving...' :
           isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
