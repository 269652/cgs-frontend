import { fetchNotFoundPageData } from "@/lib/sources/strapi/not-found-page";
import NotFoundClient from "@/components/NotFoundClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Seite nicht gefunden",
  description: "Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.",
  openGraph: {
    title: "404 - Seite nicht gefunden",
    description: "Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.",
    images: [
      {
        url: "/api/og?slug=404",
        width: 1200,
        height: 630,
        alt: "404 - Seite nicht gefunden"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "404 - Seite nicht gefunden",
    description: "Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.",
    images: ["/api/og?slug=404"] 
  }
};

// Revalidate every 30 seconds to pick up changes from Strapi
export const revalidate = 30;

export default async function NotFound() {
  // Fetch 404 page configuration from Strapi
  const pageData = await fetchNotFoundPageData();
  
  // Fallback to default values if Strapi data is unavailable
  const defaultData = {
    headline: "Seite nicht gefunden",
    description: "Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.",
    primaryButtonText: "Zur Startseite",
    primaryButtonUrl: "/",
    secondaryButtonText: "Zurück",
    helpText: "Vielleicht finden Sie hier was Sie suchen:",
    helpfulLinks: [
      { label: "Startseite", url: "/" },
      { label: "Kontakt", url: "/ansprechpartner" },
      { label: "Impressum", url: "/impressum" }
    ]
  };
  
  const data = pageData || defaultData;
  
  return <NotFoundClient {...data} />;
}