import axios from 'axios';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

interface StrapiMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  favicon?: any;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: any;
  ogType?: 'website' | 'article' | 'profile' | 'book';
  ogLocale?: string;
  ogSiteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: any;
  twitterSite?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  robots?: string;
  themeColor?: string;
  appleTouchIcon?: any;
}

interface DefaultMetadataResponse {
  data: Array<{
    id: number;
    documentId: string;
    name: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    favicon?: any;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: any;
    ogType?: 'website' | 'article' | 'profile' | 'book';
    ogLocale?: string;
    ogSiteName?: string;
    twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: any;
    twitterSite?: string;
    twitterCreator?: string;
    canonicalUrl?: string;
    robots?: string;
    themeColor?: string;
    appleTouchIcon?: any;
  }>;
  meta?: any;
  error?: string;
}

// Cache for default metadata to avoid repeated API calls
let defaultMetadataCache: StrapiMetadata | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchDefaultMetadata(): Promise<{ data: StrapiMetadata | null; error?: string }> {
  // Check cache first
  const now = Date.now();
  if (defaultMetadataCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return { data: defaultMetadataCache };
  }

  try {
    const response = await axios.get<DefaultMetadataResponse>(
      `${STRAPI_URL}/api/site-metadatas`,
      {
        params: {
          populate: '*',
          filters: {
            name: {
              $eq: 'Default'
            }
          }
        }
      }
    );

    const defaultEntry = response.data?.data?.[0];
    
    if (defaultEntry) {
      // The metadata is directly on the entry object, not nested
      const metadata: StrapiMetadata = {
        metaTitle: defaultEntry.metaTitle,
        metaDescription: defaultEntry.metaDescription,
        keywords: defaultEntry.keywords,
        favicon: defaultEntry.favicon,
        ogTitle: defaultEntry.ogTitle,
        ogDescription: defaultEntry.ogDescription,
        ogImage: defaultEntry.ogImage,
        ogType: defaultEntry.ogType,
        ogLocale: defaultEntry.ogLocale,
        ogSiteName: defaultEntry.ogSiteName,
        twitterCard: defaultEntry.twitterCard,
        twitterTitle: defaultEntry.twitterTitle,
        twitterDescription: defaultEntry.twitterDescription,
        twitterImage: defaultEntry.twitterImage,
        twitterSite: defaultEntry.twitterSite,
        twitterCreator: defaultEntry.twitterCreator,
        canonicalUrl: defaultEntry.canonicalUrl,
        robots: defaultEntry.robots,
        themeColor: defaultEntry.themeColor,
        appleTouchIcon: defaultEntry.appleTouchIcon,
      };
      
      // Update cache
      defaultMetadataCache = metadata;
      cacheTimestamp = now;
      
      return { data: metadata };
    } else {
      return { data: null, error: 'Default metadata entry not found. Make sure you have an entry with name "Default"' };
    }
  } catch (error) {
    console.error('Error fetching default metadata:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error fetching default metadata' 
    };
  }
}

// Clear the cache (useful for development or when metadata is updated)
export function clearDefaultMetadataCache(): void {
  defaultMetadataCache = null;
  cacheTimestamp = 0;
}