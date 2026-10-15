import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pilih Mode Photobooth',
  description:
    'Pilih pengalaman foto terbaikmu di GenSNAP: Foto Klasik multi-shot, Live Photo dengan motion interaktif, atau Video Strip.',
};

export default function ModeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
