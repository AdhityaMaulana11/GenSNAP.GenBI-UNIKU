import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pratinjau Hasil Foto',
  description:
    'Pratinjau hasil jepretan photobooth, atur filter warna, dan sesuaikan tata letak foto sebelum dicetak.',
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
