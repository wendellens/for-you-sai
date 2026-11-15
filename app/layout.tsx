import type { Metadata, Viewport } from 'next';
import { DM_Sans, Playfair_Display, Caveat } from 'next/font/google';
import './globals.css';

// Self-hosted at build time by Next, so there is no render-blocking Google Fonts @import.
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--font-dm' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700'], style: ['normal', 'italic'], display: 'swap', variable: '--font-playfair' });
const caveat = Caveat({ subsets: ['latin'], weight: ['500', '600'], display: 'swap', variable: '--font-caveat' });

const title = 'For You, Sai ♡';
const description = 'A little garden of memories, love, and birthday wishes.';

// On Vercel this resolves to your real domain, so the link-preview image gets an absolute URL.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  // Personal photos and a private letter: keep this out of search engines.
  robots: { index: false, follow: false },
  // Link preview when the URL is sent in a chat. Remove `images` to keep the photo a surprise.
  openGraph: {
    title,
    description,
    type: 'website',
    images: [{ url: '/images/sai-main.jpg', width: 1599, height: 1200, alt: 'For you, Sai' }],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌸</text></svg>",
  },
};

export const viewport: Viewport = { themeColor: '#fffaf8' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
