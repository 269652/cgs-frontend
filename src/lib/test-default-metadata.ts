/**
 * Test utility for the default metadata system
 * Run this in your browser console or as a Node.js script to test the API
 */

// Test function to check if default metadata is working
export async function testDefaultMetadata() {
  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  
  try {
    console.log('🧪 Testing default metadata system...');
    
    // Test the API endpoint
    const response = await fetch(
      `${STRAPI_URL}/api/site-metadatas?filters[name][$eq]=Default&populate[siteMetadata][populate]=*`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('📊 API Response:', data);
    
    // Check if we have the default entry
    if (!data.data || data.data.length === 0) {
      console.error('❌ No "Default" metadata entry found in Strapi');
      console.log('💡 Create a Site Metadata entry with name "Default"');
      return false;
    }
    
    const defaultEntry = data.data[0];
    console.log('✅ Found default metadata entry:', defaultEntry.name);
    
    // Check if siteMetadata exists
    if (!defaultEntry.siteMetadata) {
      console.error('❌ Default entry has no siteMetadata');
      return false;
    }
    
    const metadata = defaultEntry.siteMetadata;
    console.log('📋 Default metadata content:');
    console.log('  Title:', metadata.metaTitle || '(not set)');
    console.log('  Description:', metadata.metaDescription || '(not set)');
    console.log('  Keywords:', metadata.keywords || '(not set)');
    console.log('  OG Title:', metadata.ogTitle || '(not set)');
    console.log('  OG Image:', metadata.ogImage ? '✅ Set' : '❌ Not set');
    console.log('  Favicon:', metadata.favicon ? '✅ Set' : '❌ Not set');
    
    // Check required fields
    const requiredFields = ['metaTitle', 'metaDescription'];
    const missingFields = requiredFields.filter(field => !metadata[field]);
    
    if (missingFields.length > 0) {
      console.warn('⚠️  Missing recommended fields:', missingFields.join(', '));
    } else {
      console.log('✅ All recommended fields are set');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error testing default metadata:', error);
    return false;
  }
}

// Browser-compatible version
if (typeof window !== 'undefined') {
  (window as any).testDefaultMetadata = testDefaultMetadata;
  console.log('🔧 Default metadata test loaded. Run testDefaultMetadata() to test.');
}