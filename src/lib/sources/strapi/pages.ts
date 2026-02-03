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

export async function fetchPageBySlug(slug: string) {
  try {
    console.log(`${process.env.STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}`)
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
