import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Download Fotomu | GenSNAP',
  description: 'Scan QR code untuk mendownload hasil photostrip GenSNAP kamu.',
  robots: { index: false, follow: false },
};

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
