import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pilih Frame Foto',
  description:
    'Koleksi frame eksklusif Champions Explorer 2026 dan tema resmi GenBI UNIKU untuk sesi fotomu.',
};

export default function FramesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
