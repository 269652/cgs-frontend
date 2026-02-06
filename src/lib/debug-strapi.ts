/**
 * Debug utility to check what content types are available in Strapi
 * This helps diagnose metadata API issues
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function debugStrapiContentTypes() {
  console.log('🔍 Debugging Strapi content types...');
  console.log('Strapi URL:', STRAPI_URL);
  
  try {
    // Try to get content-type information from Strapi
    const response = await fetch(`${STRAPI_URL}/api/content-type-builder/content-types`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📋 Available content types:', Object.keys(data.data || {}));
    } else {
      console.log('⚠️  Could not access content-type-builder (this is normal in production)');
    }
  } catch (error) {
    console.log('⚠️  Content-type-builder not accessible');
  }
  
  // Try common API endpoints to see what's available
  const commonEndpoints = [
    'pages',
    'site-metadatas', 
    'site-metadata',
    'metadata',
    'metadatas',
    'default-metadata',
    'default-metadatas',
    'global',
    'globals'
  ];
  
  console.log('\n🧪 Testing common API endpoints:');
  
  for (const endpoint of commonEndpoints) {
    try {
      const response = await fetch(`${STRAPI_URL}/api/${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ /api/${endpoint} - ${data.data?.length || 0} entries`);
        
        // If this looks like a metadata endpoint, show structure
        if (endpoint.includes('metadata') && data.data?.[0]) {
          const firstEntry = data.data[0];
          console.log(`   Sample entry structure:`, Object.keys(firstEntry));
          
          if (firstEntry.name) {
            console.log(`   Entry names: ${data.data.map((entry: any) => entry.name).join(', ')}`);
          }
        }
      } else {
        console.log(`❌ /api/${endpoint} - ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ /api/${endpoint} - Network error`);
    }
  }
  
  console.log('\n💡 If you see a metadata-related endpoint above, that\'s likely the one you need!');
  console.log('💡 Make sure you have a "Site Metadata" content type with a "name" field set to "Default"');
}

// Browser-compatible version
if (typeof window !== 'undefined') {
  (window as any).debugStrapiContentTypes = debugStrapiContentTypes;
  console.log('🔧 Strapi debug loaded. Run debugStrapiContentTypes() to check your setup.');
}