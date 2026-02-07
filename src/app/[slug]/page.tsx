import { Metadata } from "next";
import { fetchPageBySlug, fetchAllSlugs } from "@/lib/sources/strapi/pages";
import { getNavigationData } from "@/lib/sources/strapi/navigation";
import Page from "@/components/Page";
import StrapiCustomCSS from "@/components/StrapiCustomCSS";
import { buildMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

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
  return await buildMetadata(page?.siteMetadata, `/${slug}`);
}

export default async function Home({ params }: Props) {
  const slug = (await params).slug;
  const pageData = await fetchPageBySlug(slug);
  const navigation = await getNavigationData();
  
  // Check for Strapi connection error (500)
  if (pageData.error) {
    throw new Error(`Failed to fetch page data: ${pageData.error}`);
  }
  
  // Strapi v5 returns { data: [...] }
  const pages = pageData.data || [];
  // Assume first page for demo
  const page = pages[0] || {};
  
  // Handle case where no page is found (404)
  if (!page.id && pages.length === 0) {
    notFound();
  }
  
  const groups = page.groups || [];
  return (
    <div className="font-sans items-center justify-items-center min-h-screen bg-white dark:bg-gray-900">
      <StrapiCustomCSS slug={slug} />
      <main className="flex flex-col items-center w-full">
        <Page groups={groups} navigation={navigation} {...page} />
      </main>
    </div>
  );
}

export const revalidate = 30;
