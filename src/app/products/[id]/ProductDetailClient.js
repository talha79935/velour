'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, ChevronLeft, Star, Check, Minus, Plus, Truck, Shield } from 'lucide-react';
import styles from './product.module.css';

export default function ProductDetailClient({ product }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const sizes = (() => { try { return JSON.parse(product.sizes || '[]'); } catch { return []; } })();
  const colors = (() => { try { return JSON.parse(product.colors || '[]'); } catch { return []; } })();
  const images = (() => { try { return JSON.parse(product.images || '[]'); } catch { return []; } })();
  const allImages = images.length > 0 ? images : [product.imageUrl].filter(Boolean);
  const [activeImage, setActiveImage] = useState(allImages[0] || '/products/placeholder.jpg');

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  const addToCart = () => {
    if (sizes.length > 0 && !selectedSize) return alert('Please select a size');
    const cart = JSON.parse(localStorage.getItem('velour-cart') || '[]');
    const key = `${product.id}-${selectedSize}-${selectedColor}`;
    const existing = cart.findIndex((i) => i.key === key);
    if (existing >= 0) {
      cart[existing].quantity += quantity;
    } else {
      cart.push({
        key,
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
        size: selectedSize,
        color: selectedColor,
        category: product.category,
      });
    }
    localStorage.setItem('velour-cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('velour-cart-updated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Shop</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className={styles.layout}>
          {/* Image Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.isNew && <span className={`badge badge-new ${styles.imageBadge}`}>New</span>}
              {discount && <span className={`badge badge-sale ${styles.imageBadgeSale}`}>−{discount}%</span>}
            </div>
            {allImages.length > 1 && (
              <div className={styles.thumbs}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${activeImage === img ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <Image src={img} alt={`${product.name} view ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={styles.info}>
            {/* Category + Rating */}
            <div className={styles.topMeta}>
              <span className={styles.catTag}>{product.subcategory || product.category}</span>
              <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill={i < 4 ? 'var(--gold)' : 'none'} color="var(--gold)" />
                ))}
                <span className={styles.ratingText}>4.9 · 24 reviews</span>
              </div>
            </div>

            <h1 className={styles.title}>{product.name}</h1>

            {/* Price */}
            <div className={styles.priceBlock}>
              <span className={styles.price}>PKR {product.price.toLocaleString()}</span>
              {product.comparePrice && (
                <>
                  <span className={styles.comparePrice}>PKR {product.comparePrice.toLocaleString()}</span>
                  <span className={styles.saveBadge}>Save {discount}%</span>
                </>
              )}
            </div>

            <p className={styles.desc}>{product.description}</p>

            <div className={styles.divider} />

            {/* Color Selector */}
            {colors.length > 0 && (
              <div className={styles.selectorGroup}>
                <label className={styles.selectorLabel}>
                  Color <span className={styles.selectorSelected}>{selectedColor || 'Select'}</span>
                </label>
                <div className={styles.colorOptions}>
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`${styles.colorBtn} ${selectedColor === color ? styles.optionSelected : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div className={styles.selectorGroup}>
                <label className={styles.selectorLabel}>
                  Size <span className={styles.selectorSelected}>{selectedSize || 'Select'}</span>
                </label>
                <div className={styles.sizeOptions}>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.optionSelected : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <Link href="#" className={styles.sizeGuide}>Size Guide →</Link>
              </div>
            )}

            {/* Quantity + CTA */}
            <div className={styles.addToCart}>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={14} />
                </button>
                <span className={styles.qty}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                className={`btn btn-primary ${styles.cartBtn} ${added ? styles.cartAdded : ''}`}
                onClick={addToCart}
              >
                {added ? <><Check size={16} /> Added to Cart!</> : <><ShoppingBag size={16} /> Add to Cart</>}
              </button>

              <button
                className={`${styles.wishBtn} ${isWishlisted ? styles.wishlisted : ''}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Stock */}
            <div className={styles.stockRow}>
              <div className={`${styles.stockDot} ${product.stock < 20 ? styles.stockLow : ''}`} />
              <span className={styles.stockText}>
                {product.stock > 20 ? 'In Stock — Ready to ship' :
                 product.stock > 5 ? `Only ${product.stock} left` :
                 `Last ${product.stock} — Order now`}
              </span>
            </div>

            <div className={styles.divider} />

            {/* Trust */}
            <div className={styles.trust}>
              <div className={styles.trustItem}>
                <Truck size={16} className={styles.trustIcon} />
                <span>Free shipping over PKR 5,000</span>
              </div>
              <div className={styles.trustItem}>
                <Shield size={16} className={styles.trustIcon} />
                <span>Authenticity guaranteed</span>
              </div>
              <div className={styles.trustItem}>
                <Check size={16} className={styles.trustIcon} />
                <span>30-day hassle-free returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
