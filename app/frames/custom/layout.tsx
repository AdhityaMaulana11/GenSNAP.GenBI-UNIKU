import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Custom Frame',
  description:
    'Gunakan desain frame kreasimu sendiri format PNG transparan untuk photobooth GenSNAP.',
};

export default function CustomFrameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
