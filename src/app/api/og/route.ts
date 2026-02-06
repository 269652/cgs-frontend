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

async function ensureCacheDir() {
  if (!existsSync(CACHE_DIR)) {
    await mkdir(CACHE_DIR, { recursive: true });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug') || '/';
  const cacheKey = slug.replace(/\//g, '_') || 'home';
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.png`);
  
  try {
    await ensureCacheDir();
    
    if (existsSync(cachePath)) {
      const cachedImage = await readFile(cachePath);
      const mtime = (await import('fs')).statSync(cachePath).mtime;
      const age = Date.now() - mtime.getTime();
      
      // Cache for 30 seconds
      if (age < 30 * 1000) {
        return new NextResponse(Buffer.from(cachedImage), {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=30, s-maxage=30',
          },
        });
      }
    }
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: OG_WIDTH, height: OG_HEIGHT });
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_SITE_URL not set');
    }
    const url = `${baseUrl}${slug}`;
    
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
      type: 'png',
      clip: { x: 0, y: 0, width: OG_WIDTH, height: OG_HEIGHT },
    });
    
    await browser.close();
    await writeFile(cachePath, screenshot);
    
    return new NextResponse(Buffer.from(screenshot), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=30, s-maxage=30',
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
