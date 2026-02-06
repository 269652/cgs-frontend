import { NavigationCategory } from '@/types/navigation';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

async function fetchWithRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === MAX_RETRIES) throw error;
      console.warn(`Navigation fetch attempt ${attempt}/${MAX_RETRIES} failed, retrying in ${RETRY_DELAY}ms...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
  throw new Error('Unreachable');
}

export async function getNavigationData(): Promise<NavigationCategory[]> {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || 'http://localhost:1337';
    return await fetchWithRetry(async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(
          `${strapiUrl}/api/navigation-categories?populate=*&sort=order:asc`,
          {
            next: { revalidate: 30 },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch navigation data: ${response.status}`);
        }

        const result = await response.json();
        return result.data || [];
      } finally {
        clearTimeout(timeout);
      }
    });
  } catch (error) {
    console.error('Error fetching navigation data:', error);
    return [];
  }
}