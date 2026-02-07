import { Metadata } from "next";
import Page from "../components/Page";
import { fetchPageBySlug, fetchPages } from "../lib/sources/strapi/pages";
import { getNavigationData } from "../lib/sources/strapi/navigation";
import { buildMetadata } from "../lib/metadata";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchPageBySlug('/');
  const page = pageData.data?.[0];
  return await buildMetadata(page?.siteMetadata, '/');
}

export default async function Home() {
  const pageData = await fetchPageBySlug('/');
  const navigation = await getNavigationData();
  
  // Check for Strapi connection error (500)
  if (pageData.error) {
    throw new Error(`Failed to fetch homepage data: ${pageData.error}`);
  }
  
  // Strapi v5 returns { data: [...] }
  const pages = pageData.data || [];
  // Assume first page for demo
  const page = pages[0] || {};
  
  // Handle case where no homepage is found (404)
  if (!page.id && pages.length === 0) {
    notFound();
  }
  
  const groups = page.groups || [];
  const header = page.header || null;
  const footer = page.footer || null;
  
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
