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

export const metadata: Metadata = {
  title: 'GenSNAP by GenBI UNIKU | Digital Photobooth',
  description: 'Klik Momennya, Abadikan Ceritanya. The ultimate browser-based digital photobooth experience by GenBI UNIKU.',
  keywords: ['photobooth', 'genbi', 'uniku', 'gensnap', 'digital photobooth', 'camera', 'photo frame'],
  authors: [{ name: 'GenBI UNIKU' }],
  icons: {
    icon: '/Logo-GenBI-Uniku.png',
    shortcut: '/Logo-GenBI-Uniku.png',
    apple: '/Logo-GenBI-Uniku.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#00327d',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${bricolage.variable} ${jakarta.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fcf9f8] text-[#1c1b1b]">
        <PhotoboothProvider>{children}</PhotoboothProvider>
      </body>
    </html>
  );
}
