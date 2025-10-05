import { fetchPageBySlug } from "@/lib/sources/strapi/pages";
import { getNavigationData } from "@/lib/sources/strapi/navigation";
import Page from "@/components/Page";
import ErrorDisplay from "@/components/ErrorDisplay";

export default async function Home({ params }: any) {
  console.log("SLUG", (await params).slug);
  const pageData = await fetchPageBySlug((await params).slug);
  const navigation = await getNavigationData();
  
  // Check for Strapi connection error
  if (pageData.error) {
    return (
      <ErrorDisplay 
        error={pageData.error} 
        retryUrl={`/${(await params).slug}`}
      />
    );
  }
  
  console.log("DATA", pageData.data);
  // Strapi v5 returns { data: [...] }
  const pages = pageData.data || [];
  // Assume first page for demo
  const page = pages[0] || {};
  
  // Handle case where no page is found (404)
  if (!page.id && pages.length === 0) {
    return (
      <ErrorDisplay 
        variant="404"
        message={`The page "${(await params).slug}" could not be found.`}
      />
    );
  }
  
  const groups = page.groups || [];
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
