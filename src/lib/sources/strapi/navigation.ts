import { NavigationCategory } from '@/types/navigation';

export async function getNavigationData(): Promise<NavigationCategory[]> {
  try {
    const response = await fetch(
      'http://localhost:1337/api/navigation-categories?populate=*&sort=order:asc',
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