import React from "react";
import Group from "./Group";
import Row from "./Row";
import Header from "./Header";
import Footer from "./Footer";
import { NavigationCategory } from "@/types/navigation";
import { processImagesWithBlur, processImageWithBlur } from "@/lib/imageProcessor";

interface PageContentComponent {
  __component: string;
  id: number;
  title?: string;
  groups?: any[];
  [key: string]: any;
}

interface PageProps {
  header?: any;
  footer?: any;
  pageContent?: PageContentComponent[];
  // Legacy props for backward compatibility
  groups?: any[];
  rows?: Array<{ groups: any[] }>;
  navigation?: NavigationCategory[];
}

const Page: React.FC<PageProps> = async ({
  header,
  footer,
  pageContent,
  groups,
  rows,
  navigation,
}) => {
  console.log ("PAGE FOOTER", footer)
  
  // Pre-process header images with blur data for no-JS support
  let processedHeader = header;
  if (header) {
    const [processedLogo, processedImages] = await Promise.all([
      header.logo ? processImageWithBlur(header.logo) : null,
      header.images ? processImagesWithBlur(header.images) : []
    ]);
    
    processedHeader = {
      ...header,
      logo: processedLogo,
      images: processedImages
    };
  }
  const renderPageContent = () => {
    if (pageContent && pageContent.length > 0) {
      return pageContent.map((component, idx) => {
        switch (component.__component) {
          case "page.row":
            return (
              <Row 
                key={`${component.__component}-${component.id || idx}`} 
                groups={component.groups || []} 
                title={component.title}
              />
            );
          case "page.group":
            return (
              <Group
                key={`${component.__component}-${component.id || idx}`}
                title={component.title}
                backgroundImage={component.bgImage}
                content={component.content}
                sections={component.sections || []}
              />
            );
          default:
            console.warn(`Unknown component type: ${component.__component}`);
            return null;
        }
      });
    }

    // Legacy fallback for backward compatibility
    if (rows && rows.length > 0) {
      return rows.map((row, idx) => <Row key={idx} groups={row.groups} />);
    }

    if (groups && groups.length > 0) {
      return groups.map((group, idx) => (
        <Group
          key={idx}
          backgroundImage={group.bgImage}
          sections={group.sections}
          header={header}
          navigation={navigation}
        />
      ));
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col w-full  dark:bg-gray-900">
      {processedHeader && <Header {...processedHeader} navigation={navigation} />}
      <main className="dark flex-1 w-full  dark:bg-gray-800">
        {renderPageContent()}
      </main>
      {footer && <Footer {...footer} />}
    </div>
  );
};

export default Page;
