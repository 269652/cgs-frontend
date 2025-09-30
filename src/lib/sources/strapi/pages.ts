import axios from 'axios';

export async function fetchPages() {
  const res = await axios.get(`${process.env.STRAPI_URL}/api/pages?populate=*`);
  return res.data;
}
