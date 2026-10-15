import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { PhotoboothProvider } from '@/lib/session/session-context';

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
});

const siteUrl = 'https://gensnap-genbi-uniku.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GenSNAP by GenBI UNIKU | Digital Photobooth',
    template: '%s | GenSNAP by GenBI UNIKU',
  },
  description: 'Klik Momennya, Abadikan Ceritanya. The ultimate browser-based digital photobooth experience by GenBI UNIKU.',
  keywords: [
    'photobooth',
    'genbi',
    'uniku',
    'gensnap',
    'digital photobooth',
    'camera',
    'photo frame',
    'champions explorer',
    'bank indonesia',
    'universitas kuningan',
  ],
  authors: [{ name: 'GenBI UNIKU', url: 'https://instagram.com/genbi_uniku' }],
  creator: 'GenBI UNIKU',
  publisher: 'GenBI UNIKU',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'GenSNAP by GenBI UNIKU | Digital Photobooth',
    description: 'Klik Momennya, Abadikan Ceritanya. The ultimate browser-based digital photobooth experience by GenBI UNIKU.',
    url: siteUrl,
    siteName: 'GenSNAP by GenBI UNIKU',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/champions-explorer1.png',
        width: 1200,
        height: 630,
        alt: 'GenSNAP by GenBI UNIKU - Digital Photobooth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GenSNAP by GenBI UNIKU | Digital Photobooth',
    description: 'Klik Momennya, Abadikan Ceritanya. Browser-based digital photobooth by GenBI UNIKU.',
    images: ['/champions-explorer1.png'],
    creator: '@genbi_uniku',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/Logo-GenBI-Uniku.png', type: 'image/png' },
    ],
    shortcut: '/Logo-GenBI-Uniku.png',
    apple: '/Logo-GenBI-Uniku.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3E4095',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#webapp`,
      name: 'GenSNAP by GenBI UNIKU',
      url: siteUrl,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'All modern web browsers',
      browserRequirements: 'Requires camera permission for photobooth capture',
      description: 'Klik Momennya, Abadikan Ceritanya. The ultimate browser-based digital photobooth experience by GenBI UNIKU.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'IDR',
      },
      creator: {
        '@type': 'Organization',
        name: 'GenBI UNIKU',
        url: 'https://instagram.com/genbi_uniku',
        logo: `${siteUrl}/Logo-GenBI-Uniku.png`,
      },
    },
    {
      '@type': 'Event',
      '@id': `${siteUrl}/#event`,
      name: 'Champions Explorer 2026',
      description: 'Explore the World of Central Banking: Buka Wawasan, Jelajahi Tantangan, Temukan Pengetahuan',
      organizer: {
        '@type': 'Organization',
        name: 'GenBI UNIKU',
        url: 'https://instagram.com/genbi_uniku',
      },
      location: {
        '@type': 'Place',
        name: 'Universitas Kuningan',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kuningan',
          addressRegion: 'Jawa Barat',
          addressCountry: 'ID',
        },
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${bricolage.variable} ${jakarta.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-[100dvh] flex flex-col bg-[#fcf9f8] text-[#1F1A17]"
      >
        <PhotoboothProvider>{children}</PhotoboothProvider>
      </body>
    </html>
  );
}
