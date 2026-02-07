import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Force Node.js runtime (required for Puppeteer)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CACHE_DIR = path.join(process.cwd(), '.og-cache');
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function ensureCacheDir() {
  if (!existsSync(CACHE_DIR)) {
    await mkdir(CACHE_DIR, { recursive: true });
  }
}

async function getPageLastUpdated(slug: string): Promise<Date | null> {
  // Special handling for 404 page - use not-found-page endpoint
  if (slug === '404') {
    try {
      const response = await fetch(`${STRAPI_URL}/api/not-found-page?fields[0]=updatedAt`);
      const data = await response.json();
      if (data.data?.updatedAt) {
        return new Date(data.data.updatedAt);
      }
    } catch (error) {
      console.error('Error fetching 404 page update time:', error);
    }
    return null;
  }
  
  // Regular pages
  try {
    const response = await fetch(`${STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&fields[0]=updatedAt`);
    const data = await response.json();
    if (data.data && data.data[0]?.updatedAt) {
      return new Date(data.data[0].updatedAt);
    }
  } catch (error) {
    console.error('Error fetching page update time:', error);
  }
  return null;
}

async function generateScreenshot(slug: string, cachePath: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.setViewport({ 
    width: OG_WIDTH, 
    height: OG_HEIGHT,
    deviceScaleFactor: 1, // 1x scale to keep file size down
  });
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL not set');
  }
  
  // Special handling for 404 page - navigate to a non-existent page to trigger 404
  const url = slug === '404' 
    ? `${baseUrl}/this-page-does-not-exist-404` 
    : `${baseUrl}${slug}`;
  
  console.log('Generating OG image for:', url);
  
  await page.goto(url, {
    waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
    timeout: 120000,
  });
  
  // Wait an additional moment for images and fonts to load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Scroll to trigger lazy loading
  await page.evaluate(() => {
    window.scrollTo(0, 630);
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Scroll back to top for screenshot
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const screenshot = await page.screenshot({
    type: 'webp',
    quality: 80, // WebP quality 80 gives excellent compression with great quality
    clip: { x: 0, y: 0, width: OG_WIDTH, height: OG_HEIGHT },
    omitBackground: false,
  });
  
  await browser.close();
  
  // Save to cache
  const buffer = Buffer.from(screenshot);
  await writeFile(cachePath, buffer);
  
  return buffer;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug') || '/';
  const cacheKey = slug.replace(/\//g, '_') || 'home';
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.webp`);
  
  try {
    await ensureCacheDir();
    
    // Check if cached version exists
    if (existsSync(cachePath)) {
      const cachedImage = await readFile(cachePath);
      const cacheStats = (await import('fs')).statSync(cachePath);
      const cacheTime = cacheStats.mtime;
      
      // Get page last updated time from Strapi
      const pageUpdated = await getPageLastUpdated(slug);
      
      // If cache is fresh (page hasn't been updated since cache was created)
      if (pageUpdated && cacheTime > pageUpdated) {
        console.log(`✅ Cache is fresh for ${slug}`);
        return new NextResponse(Buffer.from(cachedImage), {
          headers: {
            'Content-Type': 'image/webp',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            'X-Cache': 'HIT',
          },
        });
      }
      
      // Cache is stale - serve it but regenerate in background
      if (pageUpdated && cacheTime < pageUpdated) {
        console.log(`♻️ Cache is stale for ${slug} - serving and regenerating...`);
        
        // Regenerate in background (don't await)
        generateScreenshot(slug, cachePath).catch(error => {
          console.error('Background regeneration failed:', error);
        });
        
        return new NextResponse(Buffer.from(cachedImage), {
          headers: {
            'Content-Type': 'image/webp',
            'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=86400',
            'X-Cache': 'STALE',
          },
        });
      }
      
      // No page update info available, check age-based cache
      const age = Date.now() - cacheTime.getTime();
      if (age < 30 * 1000) {
        return new NextResponse(Buffer.from(cachedImage), {
          headers: {
            'Content-Type': 'image/webp',
            'Cache-Control': 'public, max-age=30, s-maxage=30',
            'X-Cache': 'HIT',
          },
        });
      }
    }
    
    // No cache or cache too old - generate fresh screenshot
    console.log(`🆕 Generating fresh screenshot for ${slug}`);
    const screenshot = await generateScreenshot(slug, cachePath);
    
    return new NextResponse(Buffer.from(screenshot), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Cache': 'MISS',
      },
    });
    
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new NextResponse(JSON.stringify({ error: String(error) }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
