import { Metadata } from "next";
import Page from "../components/Page";
import ErrorDisplay from "../components/ErrorDisplay";
import { fetchPageBySlug, fetchPages } from "../lib/sources/strapi/pages";
import { getNavigationData } from "../lib/sources/strapi/navigation";
import { buildMetadata } from "../lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchPageBySlug('/');
  const page = pageData.data?.[0];
  return buildMetadata(page?.siteMetadata);
}

export default async function Home() {
  const pageData = await fetchPageBySlug('/');
  const navigation = await getNavigationData();
  
  // Check for Strapi connection error
  if (pageData.error) {
    return <ErrorDisplay error={pageData.error} />;
  }
  
  // Strapi v5 returns { data: [...] }
  const pages = pageData.data || [];
  // Assume first page for demo
  const page = pages[0] || {};
  
  // Handle case where no homepage is found
  if (!page.id && pages.length === 0) {
    return (
      <ErrorDisplay 
        variant="404"
        title="Homepage Not Found"
        message="The homepage could not be found. Please check your content management system."
      />
    );
  }
  
  const groups = page.groups || [];
  const header = page.header || null;
  const footer = page.footer || null;
  
  console.log("page", pages, "GROUPS", groups, "NAVIGATION", navigation);
  
  return (
    <div className="font-sans items-center justify-items-center min-h-screen max-w-screen bg-white dark:bg-gray-900">
      <main className="flex flex-col items-center w-full">
        <Page 
          {...page}
        />
      </main>
    </div>
  );
}

export const revalidate = 30;
