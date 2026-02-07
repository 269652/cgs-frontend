import { fetchNotFoundPageData } from "@/lib/sources/strapi/not-found-page";
import NotFoundClient from "@/components/NotFoundClient";

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