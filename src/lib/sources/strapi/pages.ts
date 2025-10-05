import axios from 'axios';

export async function fetchPages() {
  const res = await axios.get(`${process.env.STRAPI_URL}/api/pages?populate=*`);
  return res.data;
}

export async function fetchPageBySlug(slug: string) {
  console.log(`${process.env.STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&populate=*`)
  const res = await axios.get(`${process.env.STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}&populate=*`);
  return res.data;
}
