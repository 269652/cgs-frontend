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
  appleTouchIcon?: StrapiImage;
}

export async function buildMetadata(
  siteMetadata: StrapiMetadata | null | undefined,
  slug?: string
): Promise<Metadata> {
  let effectiveMetadata = siteMetadata;
  
  // If no metadata provided, try to fetch the default metadata from Strapi
  if (!siteMetadata) {
    try {
      const defaultMetadataResult = await fetchDefaultMetadata();
      if (defaultMetadataResult.data) {
        effectiveMetadata = defaultMetadataResult.data;
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
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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

  // Use screenshot API for OG image if no explicit image is set in Strapi
  if (effectiveMetadata.ogImage?.url) {
    const ogImageUrl = imageLink(effectiveMetadata.ogImage.url);
    if (ogImageUrl && metadata.openGraph) {
      console.log('✅ Using Strapi OG image:', ogImageUrl);
      metadata.openGraph.images = [{
        url: ogImageUrl,
        width: effectiveMetadata.ogImage.width || 1200,
        height: effectiveMetadata.ogImage.height || 630,
        alt: effectiveMetadata.ogImage.alternativeText || effectiveMetadata.metaTitle || 'Open Graph Image',
      }];
    }
  } else if (slug && metadata.openGraph) {
    // No explicit OG image set - use screenshot
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const screenshotUrl = `${baseUrl}/api/og?slug=${encodeURIComponent(slug)}`;
    console.log('📸 Using screenshot OG image:', screenshotUrl);
    metadata.openGraph.images = [{
      url: screenshotUrl,
      width: 1200,
      height: 630,
      alt: effectiveMetadata.metaTitle || 'Page Screenshot',
    }];
  } else {
    console.log('⚠️ No OG image set - slug:', slug, 'openGraph:', !!metadata.openGraph);
  }

  // Twitter
  metadata.twitter = {
    card: effectiveMetadata.twitterCard || 'summary_large_image',
    title: effectiveMetadata.twitterTitle || effectiveMetadata.ogTitle || effectiveMetadata.metaTitle,
    description: effectiveMetadata.twitterDescription || effectiveMetadata.ogDescription || effectiveMetadata.metaDescription,
    site: effectiveMetadata.twitterSite,
    creator: effectiveMetadata.twitterCreator,
  };

  // Use screenshot API for Twitter image if no explicit image is set in Strapi
  if (effectiveMetadata.twitterImage?.url) {
    const twitterImageUrl = imageLink(effectiveMetadata.twitterImage.url);
    if (twitterImageUrl && metadata.twitter) {
      console.log('✅ Using Strapi Twitter image:', twitterImageUrl);
      metadata.twitter.images = [twitterImageUrl];
    }
  } else if (slug && metadata.twitter) {
    // No explicit Twitter image set - use screenshot
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const screenshotUrl = `${baseUrl}/api/og?slug=${encodeURIComponent(slug)}`;
    console.log('📸 Using screenshot Twitter image:', screenshotUrl);
    metadata.twitter.images = [screenshotUrl];
  } else {
    console.log('⚠️ No Twitter image set - slug:', slug, 'twitter:', !!metadata.twitter);
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

