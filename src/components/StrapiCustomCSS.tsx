const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

interface CustomCSS {
  id: number;
  name: string;
  css: string;
  active: boolean;
  slug: string | null;
}

async function fetchActiveCSS(slug?: string): Promise<string> {
  try {
    const params = new URLSearchParams({
      'filters[active][$eq]': 'true',
      'sort': 'order:asc',
    });

    if (slug) {
      // Fetch CSS entries matching this specific page slug
      params.set('filters[slug][$eq]', slug);
    } else {
      // Fetch global CSS entries (no slug set)
      params.set('filters[slug][$null]', 'true');
    }

    const response = await fetch(
      `${STRAPI_URL}/api/custom-csses?${params.toString()}`,
      {
        next: { 
          revalidate: 30,
          tags: ['custom-css'] 
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch custom CSS:', response.statusText);
      return '';
    }

    const json = await response.json();
    const cssFiles: CustomCSS[] = json.data || [];

    if (cssFiles.length === 0) {
      return '';
    }

    const combinedCSS = cssFiles
      .map(file => `/* ${file.name} */\n${file.css}`)
      .join('\n\n');

    return combinedCSS;
  } catch (error) {
    console.error('Error fetching custom CSS:', error);
    return '';
  }
}

export default async function StrapiCustomCSS({ slug }: { slug?: string } = {}) {
  const css = await fetchActiveCSS(slug);

  // If no CSS from Strapi, fall back to /custom.css ONLY for global CSS (no slug)
  // Page-specific CSS should just not render anything if not defined
  if (!css) {
    if (!slug) {
      // Global CSS fallback
      return (
        <link
          rel="stylesheet"
          href="/custom.css"
          data-strapi-custom-css-fallback="true"
        />
      );
    }
    // No page-specific CSS found - don't render anything
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{ __html: css }}
      data-strapi-custom-css={slug || 'global'}
    />
  );
}
