import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio Photobooth',
  description:
    'Sesi foto langsung dengan countdown otomatis, filter estetik, dan pencahayaan studio ring light.',
};

export default function BoothLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
