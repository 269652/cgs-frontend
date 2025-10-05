import { fetchPageBySlug } from "@/lib/sources/strapi/pages";
import { getNavigationData } from "@/lib/sources/strapi/navigation";
import Page from "@/components/Page";

export default async function Home({ params }: any) {
  console.log("SLUG", (await params).slug);
  const { data } = await fetchPageBySlug((await params).slug);
  console.log("DATA", data);
  // Strapi v5 returns { data: [...] }
  const pages = data || [];
  // Assume first page for demo
  const page = pages[0] || {};
  const groups = page.groups || [];
  const navigation = await getNavigationData();
  console.log("page", pages, "GROUPS", groups, navigation);
  return (
    <div className="font-sans items-center justify-items-center min-h-screen">
      <main className="flex flex-col items-center w-full">
        <Page groups={groups} navigation={navigation} {...page} />
      </main>
    </div>
  );
}

export const revalidate = 30;
