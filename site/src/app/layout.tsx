import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PreLaunchBanner } from '@/components/PreLaunchBanner';
import { JsonLd } from '@/components/ui';
import { realEstateAgentLd, websiteLd, BASE } from '@/lib/seo';
import { site } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: `${site.name} — Villages, Schools, Beaches & Live Home Search`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.shortName,
  authors: [{ name: 'Caitlin Hoffman' }],
  creator: 'Caitlin Hoffman',
  publisher: site.shortName,
  formatDetection: { telephone: true, address: true, email: true },
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF8F3' },
    { media: '(prefers-color-scheme: dark)', color: '#0A2F2F' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <PreLaunchBanner />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <JsonLd data={[realEstateAgentLd(), websiteLd()]} />
      </body>
    </html>
  );
}
