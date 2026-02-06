// Node.js 18+ has built-in fetch
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function fetchAllSlugs() {
  try {
    console.log('📋 Fetching all page slugs from Strapi...');
    const response = await fetch(`${STRAPI_URL}/api/pages?fields[0]=slug`);
    const data = await response.json();
    
    const slugs = data.data.map(page => page.slug || '/');
    console.log(`✅ Found ${slugs.length} pages:`, slugs);
    return slugs;
  } catch (error) {
    console.error('❌ Error fetching slugs from Strapi:', error);
    return ['/'];
  }
}

async function prefetchOGImage(slug) {
  const url = `${SITE_URL}/api/og?slug=${encodeURIComponent(slug)}`;
  console.log(`📸 Generating OG image for: ${slug}`);
  
  try {
    // Set a generous timeout for screenshot generation (3 minutes)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000);
    
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (response.ok) {
      console.log(`✅ Successfully generated OG image for: ${slug}`);
      return true;
    } else {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`❌ Failed to generate OG image for: ${slug} (${response.status})`);
      console.error(`   Error: ${errorText}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`❌ Timeout generating OG image for ${slug} (took > 3 minutes)`);
    } else {
      console.error(`❌ Error generating OG image for ${slug}:`, error.message);
    }
    return false;
  }
}

async function prefetchAll() {
  console.log('🚀 Starting OG image prefetch...\n');
  
  // Wait for Next.js to be ready
  console.log('⏳ Waiting for Next.js API route to be ready...');
  let retries = 0;
  let isReady = false;
  
  while (retries < 60) {  // Increased from 30 to 60 retries
    try {
      console.log(`⏳ Attempt ${retries + 1}/60 - checking ${SITE_URL}/api/og?slug=/`);
      const response = await fetch(`${SITE_URL}/api/og?slug=/`, {
        timeout: 10000  // 10 second timeout
      });
      
      // Check if we got any response (even an error response means the route exists)
      if (response) {
        console.log(`📡 Response status: ${response.status}`);
        if (response.status !== 404) {
          console.log('✅ Next.js API route is ready!\n');
          isReady = true;
          break;
        }
      }
    } catch (error) {
      console.log(`⏳ Server not ready yet: ${error.message}`);
    }
    await new Promise(resolve => setTimeout(resolve, 3000));  // Increased from 2s to 3s
    retries++;
  }
  
  if (!isReady) {
    console.error('❌ Next.js API route did not start in time');
    console.error('⚠️ Continuing anyway - images will be generated on-demand');
    // Don't exit, just skip prefetch
    return;
  }
  
  const slugs = await fetchAllSlugs();
  
  console.log(`\n📸 Prefetching ${slugs.length} OG images...\n`);
  
  let success = 0;
  let failed = 0;
  
  // Process sequentially to avoid overwhelming Puppeteer
  for (const slug of slugs) {
    const result = await prefetchOGImage(slug);
    if (result) {
      success++;
    } else {
      failed++;
    }
    // Small delay between generations to avoid memory issues
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n✨ Prefetch complete!`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('');
}

// Only run if called directly
if (require.main === module) {
  prefetchAll()
    .then(() => {
      console.log('🎉 All OG images prefetched!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Prefetch failed:', error);
      process.exit(1);
    });
}

module.exports = { prefetchAll, fetchAllSlugs, prefetchOGImage };
