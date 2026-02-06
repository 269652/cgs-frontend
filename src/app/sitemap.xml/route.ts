import { fetchAllSlugsWithDates } from '@/lib/sources/strapi/pages';

export const revalidate = 30;

function computeChangeFreq(updatedAt: string): string {
  const now = Date.now();
  const updated = new Date(updatedAt).getTime();
  const diffMs = now - updated;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 1) return 'hourly';
  if (diffDays < 7) return 'daily';
  if (diffDays < 30) return 'weekly';
  if (diffDays < 180) return 'monthly';
  return 'yearly';
}

export async function GET() {
  const baseUrl = `https://${process.env.FRONTEND_DOMAIN || 'cgs.javascript.moe'}`;
  const pages = await fetchAllSlugsWithDates();
  const now = new Date().toISOString();

  const urls = [
    `<url><loc>${baseUrl}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    ...pages.map(
      ({ slug, updatedAt }) =>
        `<url><loc>${baseUrl}/${slug}</loc><lastmod>${updatedAt}</lastmod><changefreq>${computeChangeFreq(updatedAt)}</changefreq><priority>0.7</priority></url>`
    ),
  ].join('\n  ');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
