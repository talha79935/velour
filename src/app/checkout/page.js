'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: ''
  });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('velour-cart') || '[]');
      if (stored.length === 0) {
        router.push('/cart');
      } else {
        setCart(stored);
      }
    } catch {
      router.push('/cart');
    }
  }, [router]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 350;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        items: cart,
        total,
        guestName: form.name,
        guestEmail: form.email,
        guestPhone: form.phone,
        guestAddress: `${form.address}, ${form.city} ${form.zip}`
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to process checkout');
      }

      // Success
      setSuccess(true);
      localStorage.removeItem('velour-cart');
      window.dispatchEvent(new Event('velour-cart-updated'));

      setTimeout(() => {
        router.push('/products');
      }, 4000);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main className={styles.successPage}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>
            <h1>Order Confirmed</h1>
            <p>Thank you, {form.name}. Your order has been placed successfully.</p>
            <p className={styles.redirectText}>Redirecting you to shop...</p>
            <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <div className={styles.page}>
          <div className="container">
            <Link href="/cart" className={styles.backLink}>
              <ArrowLeft size={16} /> Back to Cart
            </Link>
            
            <h1 className={styles.title}>Checkout</h1>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.layout}>
              {/* Form Section */}
              <form id="checkout-form" onSubmit={handleSubmit} className={styles.formSection}>
                <div className={styles.formCard}>
                  <h2>Contact Information</h2>
                  <div className="form-group">
                    <label className="form-label" htmlFor="chk-email">Email Address</label>
                    <input
                      id="chk-email"
                      type="email"
                      required
                      className="form-input"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="chk-phone">Phone Number</label>
                    <input
                      id="chk-phone"
                      type="tel"
                      required
                      className="form-input"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. 0300 1234567"
                    />
                  </div>
                </div>

                <div className={styles.formCard}>
                  <h2>Shipping Address</h2>
                  <div className="form-group">
                    <label className="form-label" htmlFor="chk-name">Full Name</label>
                    <input
                      id="chk-name"
                      type="text"
                      required
                      className="form-input"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="chk-address">Street Address</label>
                    <input
                      id="chk-address"
                      type="text"
                      required
                      className="form-input"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="House, Street, Area..."
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="chk-city">City</label>
                      <input
                        id="chk-city"
                        type="text"
                        required
                        className="form-input"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Lahore"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="chk-zip">ZIP / Postal Code</label>
                      <input
                        id="chk-zip"
                        type="text"
                        className="form-input"
                        value={form.zip}
                        onChange={(e) => setForm({ ...form, zip: e.target.value })}
                        placeholder="54000"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formCard}>
                  <h2>Payment Method</h2>
                  <div className={styles.paymentMethod}>
                    <input type="radio" id="cod" name="payment" defaultChecked />
                    <label htmlFor="cod" className={styles.paymentLabel}>
                      <strong>Cash on Delivery (COD)</strong>
                      <span>Pay when you receive your order</span>
                    </label>
                  </div>
                </div>

              </form>

              {/* Order Summary */}
              <div className={styles.summarySection}>
                <div className={styles.summaryCard}>
                  <h2 className={styles.summaryTitle}>Order Summary</h2>
                  
                  <div className={styles.itemsList}>
                    {cart.map((item) => (
                      <div key={item.key || item.id} className={styles.item}>
                        <div className={styles.itemImage}>
                          <Image src={item.imageUrl || '/products/placeholder.jpg'} alt={item.name} fill style={{objectFit: 'cover'}} />
                          <span className={styles.itemBadge}>{item.quantity}</span>
                        </div>
                        <div className={styles.itemInfo}>
                          <p className={styles.itemName}>{item.name}</p>
                          <p className={styles.itemMeta}>{item.size ? `Size: ${item.size}` : ''} {item.color ? `Color: ${item.color}` : ''}</p>
                        </div>
                        <div className={styles.itemPrice}>
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.totals}>
                    <div className={styles.totalRow}>
                      <span>Subtotal</span>
                      <span>PKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className={styles.totalRow}>
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `PKR ${shipping}`}</span>
                    </div>
                    <div className={styles.finalTotal}>
                      <span>Total</span>
                      <span>PKR {total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    form="checkout-form"
                    className="btn btn-primary btn-full btn-lg"
                    disabled={loading || cart.length === 0}
                  >
                    {loading ? <><Loader2 size={18} className="spin" /> Processing...</> : 'Place Order'}
                  </button>

                  <div className={styles.secureNote}>
                    <ShieldCheck size={16} />
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
