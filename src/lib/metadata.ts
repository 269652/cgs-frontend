import { Metadata } from 'next';
import { imageLink } from './imageLink';
import { metadata as defaultMetadata} from '@/app/layout';
import { fetchDefaultMetadata } from './sources/strapi/metadata';

interface StrapiImage {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string;
}

interface StrapiMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  favicon?: StrapiImage;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: StrapiImage;
  ogType?: 'website' | 'article' | 'profile' | 'book';
  ogLocale?: string;
  ogSiteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: StrapiImage;
  twitterSite?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  robots?: string;
  themeColor?: string;
  appleTouchIcon?: StrapiImage;
}

export async function buildMetadata(siteMetadata: StrapiMetadata | null | undefined): Promise<Metadata> {
  let effectiveMetadata = siteMetadata;
  
  // If no metadata provided, try to fetch the default metadata from Strapi
  if (!siteMetadata) {
    try {
      console.log('No page metadata found, attempting to fetch default metadata...');
      const defaultMetadataResult = await fetchDefaultMetadata();
      if (defaultMetadataResult.data) {
        effectiveMetadata = defaultMetadataResult.data;
        console.log('✅ Using default metadata from Strapi:', effectiveMetadata.metaTitle);
      } else {
        console.log('⚠️ Default metadata not available:', defaultMetadataResult.error);
      }
    } catch (error) {
      console.error('❌ Failed to fetch default metadata:', error);
      console.log('🔄 Falling back to layout default metadata');
    }
  }
  
  // If still no metadata (either none provided or default fetch failed), use layout default
  if (!effectiveMetadata) {
    console.log('📋 Using hardcoded default metadata from layout');
    return defaultMetadata;
  }

  const metadata: Metadata = {
    title: effectiveMetadata.metaTitle,
    description: effectiveMetadata.metaDescription,
  };

  // Keywords
  if (effectiveMetadata.keywords) {
    metadata.keywords = effectiveMetadata.keywords.split(',').map(k => k.trim());
  }

  // Robots
  if (effectiveMetadata.robots) {
    metadata.robots = effectiveMetadata.robots;
  }

  // Theme color
  if (effectiveMetadata.themeColor) {
    metadata.themeColor = effectiveMetadata.themeColor;
  }

  // Canonical URL
  if (effectiveMetadata.canonicalUrl) {
    metadata.alternates = {
      canonical: effectiveMetadata.canonicalUrl,
    };
  }

  // Open Graph
  metadata.openGraph = {
    title: effectiveMetadata.ogTitle || effectiveMetadata.metaTitle,
    description: effectiveMetadata.ogDescription || effectiveMetadata.metaDescription,
    type: effectiveMetadata.ogType || 'website',
    locale: effectiveMetadata.ogLocale || 'de_DE',
    siteName: effectiveMetadata.ogSiteName,
  };

  if (effectiveMetadata.ogImage?.url) {
    const ogImageUrl = imageLink(effectiveMetadata.ogImage.url);
    if (ogImageUrl && metadata.openGraph) {
      metadata.openGraph.images = [{
        url: ogImageUrl,
        width: effectiveMetadata.ogImage.width || 1200,
        height: effectiveMetadata.ogImage.height || 630,
        alt: effectiveMetadata.ogImage.alternativeText || effectiveMetadata.metaTitle,
      }];
    }
  }

  // Twitter
  metadata.twitter = {
    card: effectiveMetadata.twitterCard || 'summary_large_image',
    title: effectiveMetadata.twitterTitle || effectiveMetadata.ogTitle || effectiveMetadata.metaTitle,
    description: effectiveMetadata.twitterDescription || effectiveMetadata.ogDescription || effectiveMetadata.metaDescription,
    site: effectiveMetadata.twitterSite,
    creator: effectiveMetadata.twitterCreator,
  };

  if (effectiveMetadata.twitterImage?.url) {
    const twitterImageUrl = imageLink(effectiveMetadata.twitterImage.url);
    if (twitterImageUrl && metadata.twitter) {
      metadata.twitter.images = [twitterImageUrl];
    }
  } else if (effectiveMetadata.ogImage?.url) {
    // Fall back to OG image for Twitter
    const ogImageUrl = imageLink(effectiveMetadata.ogImage.url);
    if (ogImageUrl && metadata.twitter) {
      metadata.twitter.images = [ogImageUrl];
    }
  }

  // Icons (favicon and apple touch icon)
  const icons: Metadata['icons'] = {};

  if (effectiveMetadata.favicon?.url) {
    const faviconUrl = imageLink(effectiveMetadata.favicon.url);
    if (faviconUrl) {
      icons.icon = faviconUrl;
    }
  }

  if (effectiveMetadata.appleTouchIcon?.url) {
    const appleTouchIconUrl = imageLink(effectiveMetadata.appleTouchIcon.url);
    if (appleTouchIconUrl) {
      icons.apple = appleTouchIconUrl;
    }
  }

  if (Object.keys(icons).length > 0) {
    metadata.icons = icons;
  }

  return metadata;
}
