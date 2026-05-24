'use client';

import Link from 'next/link';
import { Share2, X, Video, Mail, MapPin, ArrowRight } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Newsletter Strip */}
      <div className={styles.newsletter}>
        <div className={`${styles.newsletterInner} container`}>
          <div className={styles.newsletterText}>
            <h3>Join the Inner Circle</h3>
            <p>Early access, exclusive drops, and stories from the atelier.</p>
          </div>
          <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className={styles.newsletterInput}
              id="footer-newsletter-email"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className={`${styles.main} container`}>
        {/* Brand Column */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoV}>V</span>
            <span className={styles.logoText}>ELOUR</span>
          </Link>
          <p className={styles.tagline}>Crafted with Obsession.</p>
          <p className={styles.bio}>
            Every stitch, every sole, every seam — made by hand in our atelier with materials sourced from the finest tanneries and mills in the world.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.social} aria-label="Instagram"><Share2 size={18} /></a>
            <a href="#" className={styles.social} aria-label="X (Twitter)"><X size={18} /></a>
            <a href="#" className={styles.social} aria-label="YouTube"><Video size={18} /></a>
          </div>
        </div>

        {/* Shop Links */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Shop</h4>
          <ul className={styles.colLinks}>
            <li><Link href="/products?category=shoes">Shoes</Link></li>
            <li><Link href="/products?category=clothing">Clothing</Link></li>
            <li><Link href="/products?filter=new">New Arrivals</Link></li>
            <li><Link href="/products?filter=featured">Best Sellers</Link></li>
            <li><Link href="/products">All Products</Link></li>
          </ul>
        </div>

        {/* Company Links */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Company</h4>
          <ul className={styles.colLinks}>
            <li><Link href="#about">Our Story</Link></li>
            <li><Link href="#craft">The Craft</Link></li>
            <li><Link href="#">Sustainability</Link></li>
            <li><Link href="#">Press</Link></li>
            <li><Link href="/admin">Admin Portal</Link></li>
          </ul>
        </div>

        {/* Support + Contact */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Support</h4>
          <ul className={styles.colLinks}>
            <li><Link href="#">Size Guide</Link></li>
            <li><Link href="#">Shipping & Returns</Link></li>
            <li><Link href="#">Care Instructions</Link></li>
            <li><Link href="#">FAQ</Link></li>
          </ul>
          <div className={styles.contact}>
            <a href="mailto:hello@velour.store" className={styles.contactItem}>
              <Mail size={14} /><span>hello@velour.store</span>
            </a>
            <div className={styles.contactItem}>
              <MapPin size={14} /><span>The Atelier, Design District</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className={`${styles.bottomInner} container`}>
          <p>© 2024 VELOUR. All rights reserved. Crafted with obsession.</p>
          <div className={styles.bottomLinks}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
