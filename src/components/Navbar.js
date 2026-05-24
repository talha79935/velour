'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, Search, User, ChevronDown } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('velour-cart') || '[]');
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
      } catch { setCartCount(0); }
    };
    updateCart();
    window.addEventListener('velour-cart-updated', updateCart);
    window.addEventListener('storage', updateCart);
    return () => {
      window.removeEventListener('velour-cart-updated', updateCart);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  const navLinks = [
    {
      label: 'Shop',
      href: '/products',
      children: [
        { label: 'All Products', href: '/products' },
        { label: 'Shoes', href: '/products?category=shoes' },
        { label: 'Clothing', href: '/products?category=clothing' },
        { label: 'New Arrivals', href: '/products?filter=new' },
        { label: 'Best Sellers', href: '/products?filter=featured' },
      ],
    },
    { label: 'Collections', href: '/products?filter=featured' },
    { label: 'Craft', href: '#craft' },
    { label: 'About', href: '#about' },
  ];

  return (
    <>
      <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Left — Desktop Nav */}
          <div className={styles.navLeft}>
            {navLinks.slice(0, 2).map((link) => (
              <div
                key={link.label}
                className={styles.navItem}
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                  {link.children && <ChevronDown size={12} className={styles.chevron} />}
                </Link>
                {link.children && activeDropdown === link.label && (
                  <div className={styles.dropdown}>
                    {link.children.map((child) => (
                      <Link key={child.label} href={child.href} className={styles.dropdownLink}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Center — Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoV}>V</span>
            <span className={styles.logoText}>ELOUR</span>
          </Link>

          {/* Right — Actions */}
          <div className={styles.navRight}>
            {navLinks.slice(2).map((link) => (
              <Link key={link.label} href={link.href} className={styles.navLink}>
                {link.label}
              </Link>
            ))}
            <div className={styles.actions}>
              <Link href="/login" className={styles.iconBtn} aria-label="Account">
                <User size={18} />
              </Link>
              <Link href="/cart" className={styles.cartBtn} aria-label="Cart">
                <ShoppingBag size={18} />
                {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className={styles.mobileToggle}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Menu"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileInner}>
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className={styles.mobileLink}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className={styles.mobileSub}>
                    {link.children.slice(1).map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={styles.mobileSubLink}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className={styles.mobileDivider} />
            <Link href="/login" className={styles.mobileLink} onClick={() => setIsMobileOpen(false)}>
              Account
            </Link>
            <Link href="/cart" className={styles.mobileLink} onClick={() => setIsMobileOpen(false)}>
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
