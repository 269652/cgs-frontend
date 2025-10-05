import Page from "../components/Page";
import { fetchPageBySlug, fetchPages } from "../lib/sources/strapi/pages";
import { getNavigationData } from "../lib/sources/strapi/navigation";

export default async function Home() {
  const { data } = await fetchPageBySlug('/');
  const navigation = await getNavigationData();
  
  // Strapi v5 returns { data: [...] }
  const pages = data || [];
  // Assume first page for demo
  const page = pages[0] || {};
  const groups = page.groups || [];
  const header = page.header || null;
  const footer = page.footer || null;
  
  console.log("page", pages, "GROUPS", groups, "NAVIGATION", navigation);
  
  return (
    <div className="font-sans items-center justify-items-center min-h-screen max-w-screen">
      <main className="flex flex-col items-center w-full">
        <Page 
          {...page}
        />
      </main>
    </div>
  );
}

export const revalidate = 30;
