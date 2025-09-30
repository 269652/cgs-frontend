import Page from "../components/Page";
import { fetchPages } from "../lib/sources/strapi/pages";

export default async function Home() {
  const { data } = await fetchPages();
  // Strapi v5 returns { data: [...] }
  const pages = data || [];
  // Assume first page for demo
  const page = pages[0] || {};
  const groups = page.groups || [];
  console.log("page", pages, "GROUPS", groups);
  return (
    <div className="font-sans items-center justify-items-center min-h-screen ">
      <main className="flex flex-col items-center ">
        <Page groups={groups} />
      </main>
    </div>
  );
}

export const revalidate = 30;
