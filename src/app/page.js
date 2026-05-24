import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Award, Package, Truck, RotateCcw, Star, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { featured: true, status: 'ACTIVE' },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });
  } catch { return []; }
}

async function getNewArrivals() {
  try {
    return await prisma.product.findMany({
      where: { isNew: true, status: 'ACTIVE' },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });
  } catch { return []; }
}

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  const stats = [
    { number: '72h', label: 'Craft Time per Pair' },
    { number: '100%', label: 'Handmade' },
    { number: '12+', label: 'Countries Sourced' },
    { number: '4.9★', label: 'Customer Rating' },
  ];

  const categories = [
    {
      title: 'Footwear',
      subtitle: 'Handcrafted Shoes',
      image: '/products/sneaker-black-gold.png',
      href: '/products?category=shoes',
      count: '3 styles',
    },
    {
      title: 'Apparel',
      subtitle: 'Premium Clothing',
      image: '/products/hoodie-charcoal.png',
      href: '/products?category=clothing',
      count: '4 styles',
    },
  ];

  const testimonials = [
    {
      name: 'Aisha K.',
      location: 'Karachi',
      rating: 5,
      text: 'The Noir Eclipse sneakers arrived and I was speechless. The craftsmanship is unlike anything you find locally. Worth every rupee.',
      product: 'Noir Eclipse High-Top',
    },
    {
      name: 'Hamza R.',
      location: 'Lahore',
      rating: 5,
      text: 'VELOUR\'s Shadow Hoodie is my most complimented piece. The weight, the finish, the gold emboss — it feels truly luxurious.',
      product: 'Shadow Oversized Hoodie',
    },
    {
      name: 'Zara M.',
      location: 'Islamabad',
      rating: 5,
      text: 'I gifted the Artisan Loafers to my father and he hasn\'t taken them off since. The leather softened perfectly within days.',
      product: 'Artisan Loafer — Crimson',
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* ==================== HERO ==================== */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <Image
              src="/hero-banner.png"
              alt="VELOUR Hero"
              fill
              className={styles.heroImg}
              priority
              quality={90}
            />
            <div className={styles.heroOverlay} />
          </div>
          
          <div className={`${styles.heroContent} container`}>
            <div className={styles.heroInner}>
              <p className={styles.heroEyebrow}>New Season — SS 2024</p>
              <h1 className={styles.heroTitle}>
                Crafted<br />
                <em>with</em><br />
                Obsession.
              </h1>
              <p className={styles.heroSubtitle}>
                Premium handmade shoes and clothing, born in our atelier and shipped to your door. Each piece tells a story of 72 hours of devotion.
              </p>
              <div className={styles.heroActions}>
                <Link href="/products" className="btn btn-primary btn-lg">
                  Shop Collection <ArrowRight size={16} />
                </Link>
                <Link href="#craft" className="btn btn-outline btn-lg">
                  Our Craft
                </Link>
              </div>

              {/* Hero Stats */}
              <div className={styles.heroStats}>
                {stats.map((stat) => (
                  <div key={stat.label} className={styles.heroStat}>
                    <span className={styles.heroStatNum}>{stat.number}</span>
                    <span className={styles.heroStatLabel}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className={styles.scrollIndicator}>
            <span>Scroll</span>
            <div className={styles.scrollLine} />
          </div>
        </section>

        {/* ==================== ANNOUNCEMENT STRIP ==================== */}
        <div className={styles.strip}>
          <div className={styles.stripTrack}>
            {['Free shipping on orders over PKR 5,000', 'Handcrafted in Pakistan', '30-day returns', 'Authenticity guaranteed', 'Limited edition drops every month', 'Secure checkout'].map((text, i) => (
              <span key={i} className={styles.stripItem}>
                <span className={styles.stripDot}>◆</span> {text}
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {['Free shipping on orders over PKR 5,000', 'Handcrafted in Pakistan', '30-day returns', 'Authenticity guaranteed', 'Limited edition drops every month', 'Secure checkout'].map((text, i) => (
              <span key={`dup-${i}`} className={styles.stripItem}>
                <span className={styles.stripDot}>◆</span> {text}
              </span>
            ))}
          </div>
        </div>

        {/* ==================== CATEGORIES ==================== */}
        <section className={`${styles.categories} section`}>
          <div className="container">
            <div className="section-header">
              <p className="section-label">Browse by Category</p>
              <h2 className="section-title">Curated Collections</h2>
              <p className="section-subtitle">From statement footwear to everyday essentials, every VELOUR piece is a testament to craft.</p>
            </div>
            <div className={styles.catGrid}>
              {categories.map((cat) => (
                <Link key={cat.title} href={cat.href} className={styles.catCard}>
                  <div className={styles.catImageWrap}>
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className={styles.catImage}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className={styles.catOverlay} />
                  </div>
                  <div className={styles.catContent}>
                    <p className={styles.catSubtitle}>{cat.subtitle}</p>
                    <h3 className={styles.catTitle}>{cat.title}</h3>
                    <p className={styles.catCount}>{cat.count}</p>
                    <span className={styles.catBtn}>
                      Shop Now <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FEATURED PRODUCTS ==================== */}
        <section className={`section`} style={{ background: 'var(--bg-secondary)', padding: 'clamp(60px, 8vw, 120px) 0' }}>
          <div className="container">
            <div className="section-header">
              <p className="section-label">Handpicked for You</p>
              <h2 className="section-title">Featured Pieces</h2>
              <p className="section-subtitle">Our most coveted items — each crafted to be worn for decades, not seasons.</p>
            </div>
            {featured.length > 0 ? (
              <div className="grid-4">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>Products coming soon.</p>
                <Link href="/products" className="btn btn-outline">Browse All</Link>
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link href="/products?filter=featured" className="btn btn-outline btn-lg">
                View All Featured <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== BRAND STORY / CRAFT ==================== */}
        <section className={`${styles.craft} section`} id="craft">
          <div className="container">
            <div className={styles.craftGrid}>
              <div className={styles.craftImages}>
                <div className={styles.craftImg1}>
                  <Image src="/products/loafer-burgundy.png" alt="Craft" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className={styles.craftImg2}>
                  <Image src="/products/sneaker-black-gold.png" alt="Detail" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className={styles.craftBadge}>
                  <Award size={24} className={styles.craftBadgeIcon} />
                  <span>Since 2020</span>
                  <span>Hand-Stitched</span>
                </div>
              </div>
              <div className={styles.craftText}>
                <p className="section-label">The VELOUR Craft</p>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 300, lineHeight: 1.1, marginBottom: '24px' }}>
                  Where obsession<br /><em style={{ color: 'var(--gold)' }}>meets material</em>
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.8 }}>
                  Every VELOUR piece begins as a sketch, evolves through pattern-cutting, and is brought to life by our artisans — some of the most skilled craftspeople in Pakistan. We source full-grain leather from century-old Italian tanneries and cotton fleece from Japanese mills.
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.8 }}>
                  We make things the old way. Slowly. With our hands. Each pair of shoes requires 72 hours of dedicated work across 14 stages. We believe in the beauty of the handmade.
                </p>
                <div className={styles.craftStats}>
                  {[
                    { n: '14', l: 'Stages per Shoe' },
                    { n: '72h', l: 'Craft Time' },
                    { n: '6', l: 'Artisans' },
                  ].map((s) => (
                    <div key={s.l} className={styles.craftStat}>
                      <span className={styles.craftStatNum}>{s.n}</span>
                      <span className={styles.craftStatLabel}>{s.l}</span>
                    </div>
                  ))}
                </div>
                <Link href="/products" className="btn btn-primary">
                  Explore the Collection <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== NEW ARRIVALS ==================== */}
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p className="section-label">Just Landed</p>
                <h2 className="section-title" style={{ fontSize: 'clamp(32px, 4vw, 56px)', textAlign: 'left', marginBottom: 0 }}>New Arrivals</h2>
              </div>
              <Link href="/products?filter=new" className="btn btn-ghost">
                See All <ArrowRight size={14} />
              </Link>
            </div>
            {newArrivals.length > 0 ? (
              <div className="grid-4">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>New arrivals coming soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* ==================== TRUST SIGNALS ==================== */}
        <div className={styles.trust}>
          <div className="container">
            <div className={styles.trustGrid}>
              {[
                { icon: Truck, title: 'Free Delivery', desc: 'On all orders over PKR 5,000. Express available.' },
                { icon: RotateCcw, title: '30-Day Returns', desc: 'Not satisfied? Return or exchange hassle-free.' },
                { icon: Award, title: 'Authenticity', desc: 'Every piece comes with a certificate of authenticity.' },
                { icon: Package, title: 'Luxury Packaging', desc: 'Delivered in our signature VELOUR gift box.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className={styles.trustItem}>
                  <div className={styles.trustIcon}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className={styles.trustTitle}>{title}</h4>
                    <p className={styles.trustDesc}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================== TESTIMONIALS ==================== */}
        <section className={`${styles.testimonials} section`}>
          <div className="container">
            <div className="section-header">
              <p className="section-label">What They Say</p>
              <h2 className="section-title">Customer Stories</h2>
            </div>
            <div className={styles.testGrid}>
              {testimonials.map((t) => (
                <div key={t.name} className={styles.testCard}>
                  <div className={styles.testStars}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
                    ))}
                  </div>
                  <p className={styles.testText}>&ldquo;{t.text}&rdquo;</p>
                  <div className={styles.testFooter}>
                    <div className={styles.testAvatar}>{t.name[0]}</div>
                    <div>
                      <p className={styles.testName}>{t.name}</p>
                      <p className={styles.testMeta}>{t.location} · {t.product}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FULL-WIDTH CTA ==================== */}
        <section className={styles.cta}>
          <div className={styles.ctaBg}>
            <Image src="/products/bomber-navy.png" alt="CTA" fill style={{ objectFit: 'cover', opacity: 0.25 }} />
          </div>
          <div className={`${styles.ctaContent} container`}>
            <p className="section-label">Limited Edition</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 7vw, 96px)', fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '24px' }}>
              The Midnight<br /><em style={{ color: 'var(--gold)' }}>Collection</em>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', marginBottom: '40px', fontSize: '16px', lineHeight: 1.7 }}>
              Dark silhouettes, gold hardware, limited quantities. The Midnight Collection is our most exclusive drop yet. Only 50 pieces of each item.
            </p>
            <Link href="/products" className="btn btn-primary btn-lg">
              Shop The Drop <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
