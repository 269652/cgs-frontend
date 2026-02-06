export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Don't generate at build time
export const revalidate = 30; // Revalidate every 30 seconds
export const alt = 'Clara-Grunwald-Schule';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch the screenshot from our API route using the slug
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const ogUrl = `${baseUrl}/api/og?slug=/${slug}`;
  
  const response = await fetch(ogUrl, {
    // Don't cache during development
    cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to generate OG image: ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  
  return new Response(arrayBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
