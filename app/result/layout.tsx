import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unduh Hasil Foto',
  description:
    'Unduh strip foto resolusi tinggi atau bagikan momen berhargamu di Champions Explorer 2026.',
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
