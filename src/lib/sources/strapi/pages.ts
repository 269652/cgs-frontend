import axios from 'axios';

export async function fetchPages() {
  const res = await axios.get('http://localhost:1337/api/pages?populate=*');
  return res.data;
}
