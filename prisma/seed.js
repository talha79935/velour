const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const products = [
  {
    name: 'Noir Eclipse High-Top',
    description: 'Our flagship handcrafted high-top sneaker. Premium full-grain leather upper with 24k gold-plated hardware and our signature V emboss. Each pair takes 72 hours to craft.',
    price: 485,
    comparePrice: 620,
    imageUrl: '/products/sneaker-black-gold.png',
    images: JSON.stringify(['/products/sneaker-black-gold.png']),
    category: 'shoes',
    subcategory: 'sneakers',
    sizes: JSON.stringify(['38', '39', '40', '41', '42', '43', '44', '45']),
    colors: JSON.stringify(['Black/Gold', 'All Black']),
    tags: JSON.stringify(['sneakers', 'high-top', 'leather', 'gold', 'featured']),
    stock: 24,
    featured: true,
    isNew: true,
  },
  {
    name: 'Artisan Loafer — Crimson',
    description: 'Hand-stitched with genuine burgundy calfskin leather and antique gold tassels. The orthopaedic insole is lined with genuine lambswool for unparalleled comfort.',
    price: 320,
    comparePrice: 410,
    imageUrl: '/products/loafer-burgundy.png',
    images: JSON.stringify(['/products/loafer-burgundy.png']),
    category: 'shoes',
    subcategory: 'loafers',
    sizes: JSON.stringify(['38', '39', '40', '41', '42', '43', '44', '45']),
    colors: JSON.stringify(['Burgundy/Cream', 'Cognac/Ivory']),
    tags: JSON.stringify(['loafers', 'leather', 'formal', 'handmade']),
    stock: 18,
    featured: true,
    isNew: false,
  },
  {
    name: 'Blanc Minimalist Low-Top',
    description: 'Pure simplicity. Japanese full-grain cowhide leather, hand-painted edges, and understated gold accent stitching. The perfect everyday luxury sneaker.',
    price: 360,
    comparePrice: null,
    imageUrl: '/products/sneaker-white.png',
    images: JSON.stringify(['/products/sneaker-white.png']),
    category: 'shoes',
    subcategory: 'sneakers',
    sizes: JSON.stringify(['38', '39', '40', '41', '42', '43', '44', '45']),
    colors: JSON.stringify(['White/Gold', 'Cream/Silver']),
    tags: JSON.stringify(['sneakers', 'minimal', 'white', 'clean']),
    stock: 32,
    featured: false,
    isNew: true,
  },
  {
    name: 'Shadow Oversized Hoodie',
    description: 'Weight: 450gsm premium ring-spun cotton fleece. Garment-dyed charcoal with our signature V mark embossed in gold foil on the chest. Kangaroo pocket with hidden zipper.',
    price: 195,
    comparePrice: 250,
    imageUrl: '/products/hoodie-charcoal.png',
    images: JSON.stringify(['/products/hoodie-charcoal.png']),
    category: 'clothing',
    subcategory: 'hoodies',
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Charcoal/Gold', 'Jet Black']),
    tags: JSON.stringify(['hoodie', 'oversized', 'streetwear', 'gold', 'featured']),
    stock: 45,
    featured: true,
    isNew: false,
  },
  {
    name: 'Midnight Satin Bomber',
    description: 'Aviation-inspired satin bomber jacket in midnight navy. Gold embroidered V crest on the left chest, ribbed cuffs and hem. Fully lined in pure silk.',
    price: 430,
    comparePrice: 560,
    imageUrl: '/products/bomber-navy.png',
    images: JSON.stringify(['/products/bomber-navy.png']),
    category: 'clothing',
    subcategory: 'jackets',
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Midnight Navy', 'Obsidian Black']),
    tags: JSON.stringify(['jacket', 'bomber', 'navy', 'luxury', 'featured']),
    stock: 15,
    featured: true,
    isNew: true,
  },
  {
    name: 'Essential Heavyweight Tee',
    description: '300gsm heavyweight jersey. Boxy silhouette with dropped shoulders. Screen-printed VELOUR wordmark in 24k gold foil. Pre-washed for that perfect broken-in feel from day one.',
    price: 95,
    comparePrice: 120,
    imageUrl: '/products/tshirt-black.png',
    images: JSON.stringify(['/products/tshirt-black.png']),
    category: 'clothing',
    subcategory: 'tshirts',
    sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    colors: JSON.stringify(['Jet Black', 'Washed Black', 'Off-White']),
    tags: JSON.stringify(['tshirt', 'basics', 'heavyweight', 'essential']),
    stock: 120,
    featured: false,
    isNew: false,
  },
  {
    name: 'Slate Utility Cargo Pants',
    description: 'Washed slate grey cargo pants with multiple utility pockets featuring gold D-ring hardware. Tailored slim taper from thigh to ankle. Cotton-linen blend for breathability.',
    price: 225,
    comparePrice: 290,
    imageUrl: '/products/cargo-grey.png',
    images: JSON.stringify(['/products/cargo-grey.png']),
    category: 'clothing',
    subcategory: 'pants',
    sizes: JSON.stringify(['28', '30', '32', '34', '36', '38']),
    colors: JSON.stringify(['Slate Grey', 'Washed Khaki', 'Black']),
    tags: JSON.stringify(['pants', 'cargo', 'utility', 'streetwear']),
    stock: 38,
    featured: false,
    isNew: true,
  },
];

async function main() {
  console.log('🌱 Seeding VELOUR database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@velour.store' },
    update: {},
    create: {
      email: 'admin@velour.store',
      name: 'VELOUR Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);
  console.log('   Password: admin123');

  // Create products
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.replace(/\s+/g, '-').toLowerCase() },
      update: product,
      create: {
        id: product.name.replace(/\s+/g, '-').toLowerCase(),
        ...product,
      },
    });
  }
  console.log(`✅ ${products.length} products seeded`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('   Admin: admin@velour.store / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
