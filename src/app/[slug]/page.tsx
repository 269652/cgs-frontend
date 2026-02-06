import { Metadata } from "next";
import { fetchPageBySlug, fetchAllSlugs } from "@/lib/sources/strapi/pages";
import { getNavigationData } from "@/lib/sources/strapi/navigation";
import Page from "@/components/Page";
import ErrorDisplay from "@/components/ErrorDisplay";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await fetchAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await fetchPageBySlug(slug);
  const page = pageData.data?.[0];
  return await buildMetadata(page?.siteMetadata);
}

export default async function Home({ params }: Props) {
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
  return (
    <div className="font-sans items-center justify-items-center min-h-screen bg-white dark:bg-gray-900">
      <main className="flex flex-col items-center w-full">
        <Page groups={groups} navigation={navigation} {...page} />
      </main>
    </div>
  );
}

export const revalidate = 30;
