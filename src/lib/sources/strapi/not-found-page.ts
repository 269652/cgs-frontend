import { imageLink } from '@/lib/imageLink';

interface Link {
  label: string;
  url: string;
}

export interface NotFoundPageData {
  image?: {
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
  } | null;
  headline: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  helpText: string;
  helpfulLinks: Link[];
}

export async function fetchNotFoundPageData(): Promise<NotFoundPageData | null> {
  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/not-found-page?populate=helpfulLinks&populate=image`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      console.error('Failed to fetch 404 page data:', response.statusText);
      return null;
    }
    
    const json = await response.json();
    const data = json.data;
    
    if (!data) {
      return null;
    }
    
    return {
      image: data.image ? {
        url: imageLink(data.image.url),
        alternativeText: data.image.alternativeText,
        width: data.image.width,
        height: data.image.height
      } : null,
      headline: data.headline || 'Seite nicht gefunden',
      description: data.description || 'Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.',
      primaryButtonText: data.primaryButtonText || 'Zur Startseite',
      primaryButtonUrl: data.primaryButtonUrl || '/',
      secondaryButtonText: data.secondaryButtonText || 'Zurück',
      helpText: data.helpText || 'Vielleicht finden Sie hier was Sie suchen:',
      helpfulLinks: data.helpfulLinks || []
    };
  } catch (error) {
    console.error('Error fetching 404 page data:', error);
    return null;
  }
}
