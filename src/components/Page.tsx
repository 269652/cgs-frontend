import React from "react";
import Group from "./Group";
import Row from "./Row";
import Header from "./Header";
import Footer from "./Footer";
import { NavigationCategory } from "@/types/navigation";

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

const Page: React.FC<PageProps> = ({
  header,
  footer,
  pageContent,
  groups,
  rows,
  navigation,
}) => {
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
    <div className="min-h-screen flex flex-col w-full bg-white dark:bg-gray-900">
      {header && <Header {...header} navigation={navigation} />}
      <main className="flex-1 w-full">
        {renderPageContent()}
      </main>
      {footer && <Footer {...footer} />}
    </div>
  );
};

export default Page;
