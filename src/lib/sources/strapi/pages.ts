import axios from 'axios';

const populateQuery = {
  populate: {
    header: {
      populate: {
        logo: '*',
        images: '*'
      }
    },
    footer: '*',
    siteMetadata: {
      populate: {
        favicon: '*',
        ogImage: '*',
        twitterImage: '*',
        appleTouchIcon: '*'
      }
    },
    pageContent: {
      populate: {
        groups: {
          populate: {
            content: '*',
            sections: {
              populate: {
                content: '*',
                contentRelation: '*',
                bgImage: '*'
              }
            },
            bgImage: '*'
          }
        }
      }
    },
    groups: {
      populate: {
        content: '*',
        sections: {
          populate: {
            content: '*',
            contentRelation: '*',
            bgImage: '*'
          }
        },
        bgImage: '*'
      }
    }
  }
};

export async function fetchPages() {
  try {
    const res = await axios.get(`${process.env.STRAPI_URL}/api/pages`, {
      params: populateQuery,
      timeout: 5000 // 5 second timeout
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch pages from Strapi:', error);
    return { data: [], error: 'Strapi connection failed' };
  }
}

export async function fetchAllSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const res = await axios.get(`${process.env.STRAPI_URL}/api/pages`, {
        params: {
          'fields[0]': 'slug',
          'pagination[page]': page,
          'pagination[pageSize]': 100,
        },
        timeout: 5000,
      });

      const entries = res.data?.data || [];
      for (const entry of entries) {
        if (entry.slug && entry.slug !== '/') {
          slugs.push(entry.slug);
        }
      }

      const pagination = res.data?.meta?.pagination;
      hasMore = pagination ? page < pagination.pageCount : false;
      page++;
    }
  } catch (error) {
    console.error('Failed to fetch slugs from Strapi:', error);
  }

  return slugs;
}

export async function fetchPageBySlug(slug: string) {
  try {
    const res = await axios.get(`${process.env.STRAPI_URL}/api/pages`, {
      params: {
        'filters[slug][$eq]': slug,
        ...populateQuery
      },
      timeout: 5000 // 5 second timeout
    });
    return res.data;
  } catch (error) {
    console.error(`Failed to fetch page with slug "${slug}" from Strapi:`, error);
    return { data: [], error: 'Strapi connection failed' };
  }
}
