import { Metadata } from 'next';
import { imageLink } from './imageLink';
import { metadata as defaultMetadata} from '@/app/layout';
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

export function buildMetadata(siteMetadata: StrapiMetadata | null | undefined): Metadata {
  if (!siteMetadata) {
    return defaultMetadata;
  }

  const metadata: Metadata = {
    title: siteMetadata.metaTitle,
    description: siteMetadata.metaDescription,
  };

  // Keywords
  if (siteMetadata.keywords) {
    metadata.keywords = siteMetadata.keywords.split(',').map(k => k.trim());
  }

  // Robots
  if (siteMetadata.robots) {
    metadata.robots = siteMetadata.robots;
  }

  // Theme color
  if (siteMetadata.themeColor) {
    metadata.themeColor = siteMetadata.themeColor;
  }

  // Canonical URL
  if (siteMetadata.canonicalUrl) {
    metadata.alternates = {
      canonical: siteMetadata.canonicalUrl,
    };
  }

  // Open Graph
  metadata.openGraph = {
    title: siteMetadata.ogTitle || siteMetadata.metaTitle,
    description: siteMetadata.ogDescription || siteMetadata.metaDescription,
    type: siteMetadata.ogType || 'website',
    locale: siteMetadata.ogLocale || 'de_DE',
    siteName: siteMetadata.ogSiteName,
  };

  if (siteMetadata.ogImage?.url) {
    const ogImageUrl = imageLink(siteMetadata.ogImage.url);
    if (ogImageUrl && metadata.openGraph) {
      metadata.openGraph.images = [{
        url: ogImageUrl,
        width: siteMetadata.ogImage.width || 1200,
        height: siteMetadata.ogImage.height || 630,
        alt: siteMetadata.ogImage.alternativeText || siteMetadata.metaTitle,
      }];
    }
  }

  // Twitter
  metadata.twitter = {
    card: siteMetadata.twitterCard || 'summary_large_image',
    title: siteMetadata.twitterTitle || siteMetadata.ogTitle || siteMetadata.metaTitle,
    description: siteMetadata.twitterDescription || siteMetadata.ogDescription || siteMetadata.metaDescription,
    site: siteMetadata.twitterSite,
    creator: siteMetadata.twitterCreator,
  };

  if (siteMetadata.twitterImage?.url) {
    const twitterImageUrl = imageLink(siteMetadata.twitterImage.url);
    if (twitterImageUrl && metadata.twitter) {
      metadata.twitter.images = [twitterImageUrl];
    }
  } else if (siteMetadata.ogImage?.url) {
    // Fall back to OG image for Twitter
    const ogImageUrl = imageLink(siteMetadata.ogImage.url);
    if (ogImageUrl && metadata.twitter) {
      metadata.twitter.images = [ogImageUrl];
    }
  }

  // Icons (favicon and apple touch icon)
  const icons: Metadata['icons'] = {};

  if (siteMetadata.favicon?.url) {
    const faviconUrl = imageLink(siteMetadata.favicon.url);
    if (faviconUrl) {
      icons.icon = faviconUrl;
    }
  }

  if (siteMetadata.appleTouchIcon?.url) {
    const appleTouchIconUrl = imageLink(siteMetadata.appleTouchIcon.url);
    if (appleTouchIconUrl) {
      icons.apple = appleTouchIconUrl;
    }
  }

  if (Object.keys(icons).length > 0) {
    metadata.icons = icons;
  }

  return metadata;
}
