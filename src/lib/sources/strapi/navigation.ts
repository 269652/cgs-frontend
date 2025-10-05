import { NavigationCategory } from '@/types/navigation';

export async function getNavigationData(): Promise<NavigationCategory[]> {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || 'http://localhost:1337';
    const response = await fetch(
      `${strapiUrl}/api/navigation-categories?populate=*&sort=order:asc`,
      {
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch navigation data: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    return [];
  }
}