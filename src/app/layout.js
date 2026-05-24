import './globals.css';

export const metadata = {
  title: {
    default: 'VELOUR — Crafted with Obsession',
    template: '%s | VELOUR',
  },
  description: 'Premium handcrafted shoes and clothing. Every piece is made with obsessive attention to detail, using the finest materials from around the world.',
  keywords: ['luxury fashion', 'handcrafted shoes', 'premium clothing', 'velour', 'streetwear'],
  openGraph: {
    siteName: 'VELOUR',
    type: 'website',
    locale: 'en_US',
  },
};

export const viewport = {
  themeColor: '#0c0c0c',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
