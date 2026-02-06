const fetch = require('node-fetch');

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
    const response = await fetch(url);
    if (response.ok) {
      console.log(`✅ Successfully generated OG image for: ${slug}`);
      return true;
    } else {
      console.error(`❌ Failed to generate OG image for: ${slug} (${response.status})`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error generating OG image for ${slug}:`, error.message);
    return false;
  }
}

async function prefetchAll() {
  console.log('🚀 Starting OG image prefetch...\n');
  
  // Wait for Next.js to be ready
  console.log('⏳ Waiting for Next.js to be ready...');
  let retries = 0;
  while (retries < 30) {
    try {
      const response = await fetch(`${SITE_URL}/api/og?slug=/`);
      if (response.status !== 404) {
        console.log('✅ Next.js is ready!\n');
        break;
      }
    } catch (error) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    retries++;
  }
  
  if (retries >= 30) {
    console.error('❌ Next.js did not start in time');
    process.exit(1);
  }
  
  const slugs = await fetchAllSlugs();
  
  console.log(`\n📸 Prefetching ${slugs.length} OG images...\n`);
  
  let success = 0;
  let failed = 0;
  
  for (const slug of slugs) {
    const result = await prefetchOGImage(slug);
    if (result) {
      success++;
    } else {
      failed++;
    }
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
