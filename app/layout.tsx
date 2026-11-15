
import type { Metadata, Viewport } from 'next';
import './globals.css';

const title = 'For You, Sai ♡';
const description = 'A little garden of memories, love, and birthday wishes.';

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description,
    type: 'website',
    images: [
      {
        url: '/images/sai-main.jpg',
        width: 1599,
        height: 1200,
        alt: 'For you, Sai',
      },
    ],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌸</text></svg>",
  },
};

export const viewport: Viewport = {
  themeColor: '#fffaf8',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
