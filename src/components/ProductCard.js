'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Eye, Star } from 'lucide-react';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, onAddToCart }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    try {
      const cart = JSON.parse(localStorage.getItem('velour-cart') || '[]');
      const existing = cart.findIndex((i) => i.id === product.id);
      if (existing >= 0) {
        cart[existing].quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
          category: product.category,
        });
      }
      localStorage.setItem('velour-cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('velour-cart-updated'));
      onAddToCart?.();
    } finally {
      setTimeout(() => setIsAdding(false), 800);
    }
  };

  const sizes = (() => {
    try { return JSON.parse(product.sizes || '[]'); } catch { return []; }
  })();

  return (
    <Link href={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={product.imageUrl || '/products/placeholder.jpg'}
          alt={product.name}
          fill
          className={styles.image}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className={styles.badges}>
          {product.isNew && <span className="badge badge-new">New</span>}
          {discount && <span className="badge badge-sale">−{discount}%</span>}
          {product.featured && !product.isNew && <span className="badge badge-gold">Featured</span>}
        </div>

        {/* Hover Actions */}
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${isWishlisted ? styles.wishlisted : ''}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
            aria-label="Wishlist"
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.addCart} ${isAdding ? styles.adding : ''}`}
            onClick={handleAddToCart}
            aria-label="Add to cart"
            disabled={isAdding}
          >
            <ShoppingBag size={16} />
            <span>{isAdding ? 'Added!' : 'Add to Cart'}</span>
          </button>
          <Link
            href={`/products/${product.id}`}
            className={styles.actionBtn}
            onClick={(e) => e.stopPropagation()}
            aria-label="Quick view"
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Category Tag */}
        <div className={styles.categoryTag}>
          {product.category === 'shoes' ? '👟' : '👕'} {product.subcategory || product.category}
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} fill={i < 4 ? 'var(--gold)' : 'none'} color="var(--gold)" />
          ))}
          <span className={styles.ratingCount}>(24)</span>
        </div>

        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.desc}>{product.description?.slice(0, 80)}...</p>

        {/* Sizes preview */}
        {sizes.length > 0 && (
          <div className={styles.sizes}>
            {sizes.slice(0, 5).map((size) => (
              <span key={size} className={styles.size}>{size}</span>
            ))}
            {sizes.length > 5 && <span className={styles.sizesMore}>+{sizes.length - 5}</span>}
          </div>
        )}

        <div className={styles.priceRow}>
          <div>
            <span className="price-current">PKR {product.price.toLocaleString()}</span>
            {product.comparePrice && (
              <span className="price-original" style={{ marginLeft: '8px' }}>
                PKR {product.comparePrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className={styles.stockIndicator}>
            <span className={`${styles.stockDot} ${product.stock < 20 ? styles.stockLow : ''}`} />
            <span className={styles.stockText}>
              {product.stock < 10 ? `Only ${product.stock} left` : product.stock < 20 ? 'Low stock' : 'In stock'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
