const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

interface CustomCSSEntry {
  id: number;
  documentId: string;
  name: string;
  description?: string;
  css: string;
  active: boolean;
  order: number;
  slug: string | null;
}

export async function fetchActiveCSSFiles(): Promise<CustomCSSEntry[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/custom-csses?filters[active][$eq]=true&sort=order:asc`, {
      next: { revalidate: 60 } // Cache for 1 minute
    });
    
    if (!response.ok) {
      console.error('Failed to fetch custom CSS:', response.statusText);
      return [];
    }
    
    const json = await response.json();
    
    if (!json.data || !Array.isArray(json.data)) {
      return [];
    }
    
    return json.data.map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      description: item.description,
      css: item.css,
      active: item.active,
      order: item.order,
      slug: item.slug || null
    }));
  } catch (error) {
    console.error('Error fetching custom CSS:', error);
    return [];
  }
}
