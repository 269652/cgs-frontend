import axios from 'axios';

const populateQuery = {
  populate: {
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
  const res = await axios.get(`${process.env.STRAPI_URL}/api/pages`, {
    params: populateQuery
  });
  return res.data;
}

export async function fetchPageBySlug(slug: string) {
  console.log(`${process.env.STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}`)
  const res = await axios.get(`${process.env.STRAPI_URL}/api/pages`, {
    params: {
      'filters[slug][$eq]': slug,
      ...populateQuery
    }
  });
  return res.data;
}
