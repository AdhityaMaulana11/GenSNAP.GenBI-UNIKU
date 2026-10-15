import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://gensnap-genbi-uniku.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/mode', '/frames', '/frames/custom'],
        disallow: ['/booth/', '/preview', '/result'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
