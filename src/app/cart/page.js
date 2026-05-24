'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import styles from './cart.module.css';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem('velour-cart') || '[]'));
    } catch { setCart([]); }
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('velour-cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('velour-cart-updated'));
  };

  const updateQty = (key, delta) => {
    const updated = cart.map((item) =>
      item.key === key || item.id === key
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    updateCart(updated);
  };

  const remove = (key) => {
    updateCart(cart.filter((item) => (item.key || item.id) !== key));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 350;
  const total = subtotal + shipping;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <div className={styles.page}>
          <div className="container">
            <h1 className={styles.title}>Your Cart</h1>

            {cart.length === 0 ? (
              <div className={styles.empty}>
                <ShoppingBag size={64} className={styles.emptyIcon} />
                <h2>Your cart is empty</h2>
                <p>Discover our handcrafted collection and find something you love.</p>
                <Link href="/products" className="btn btn-primary btn-lg">
                  Shop Now <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className={styles.layout}>
                {/* Cart Items */}
                <div className={styles.items}>
                  {cart.map((item) => (
                    <div key={item.key || item.id} className={styles.item}>
                      <div className={styles.itemImage}>
                        <Image
                          src={item.imageUrl || '/products/placeholder.jpg'}
                          alt={item.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemTop}>
                          <div>
                            <p className={styles.itemCategory}>{item.category}</p>
                            <h3 className={styles.itemName}>{item.name}</h3>
                            {item.size && <p className={styles.itemMeta}>Size: {item.size}</p>}
                            {item.color && <p className={styles.itemMeta}>Color: {item.color}</p>}
                          </div>
                          <button className={styles.removeBtn} onClick={() => remove(item.key || item.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className={styles.itemBottom}>
                          <div className={styles.qtyControl}>
                            <button onClick={() => updateQty(item.key || item.id, -1)}>
                              <Minus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQty(item.key || item.id, 1)}>
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className={styles.itemPrice}>
                            PKR {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className={styles.summary}>
                  <h2 className={styles.summaryTitle}>Order Summary</h2>

                  {/* Coupon */}
                  <div className={styles.coupon}>
                    <div className={styles.couponInput}>
                      <Tag size={14} />
                      <input
                        type="text"
                        placeholder="Promo code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className={styles.couponField}
                        id="coupon-code"
                      />
                    </div>
                    <button className="btn btn-ghost btn-sm">Apply</button>
                  </div>

                  <div className={styles.summaryRows}>
                    <div className={styles.summaryRow}>
                      <span>Subtotal ({cart.length} items)</span>
                      <span>PKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Shipping</span>
                      <span className={shipping === 0 ? styles.free : ''}>
                        {shipping === 0 ? 'Free' : `PKR ${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className={styles.freeShippingNote}>
                        Add PKR {(5000 - subtotal).toLocaleString()} more for free shipping
                      </p>
                    )}
                  </div>

                  <div className={styles.totalRow}>
                    <span>Total</span>
                    <span>PKR {total.toLocaleString()}</span>
                  </div>

                  <Link href="/checkout" className={`btn btn-primary btn-full ${styles.checkoutBtn}`}>
                    Proceed to Checkout <ArrowRight size={16} />
                  </Link>

                  <Link href="/products" className={`btn btn-ghost btn-full`} style={{ marginTop: '8px' }}>
                    Continue Shopping
                  </Link>

                  <div className={styles.trust}>
                    <p>🔒 Secure payment · 30-day returns · Free shipping over PKR 5,000</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
