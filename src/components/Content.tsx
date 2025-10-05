import React from "react";
import { remark } from "remark";
import html from "remark-html";

interface ContentProps {
  content: string; // Markdown content
  variant?: 'default' | 'dark';
  title?: string;
}

const Content: React.FC<ContentProps> = async ({ content, variant = 'default', title }) => {
  // Process markdown on server
  const processedContent = await remark()
    .use(html)
    .process(content);
  
  const htmlContent = processedContent.toString();

  // Define variant styles
  const variantStyles = {
    default: 'content-body',
    dark: 'content-body-dark'
  };

  const containerStyles = {
    default: 'max-w-full font-sans leading-relaxed text-gray-700 p-2 md:px-8',
    dark: 'max-w-full font-sans leading-relaxed text-gray-700 bg-gray-100 p-8 rounded-lg mt-8'
  };

  return (
    <div className={containerStyles[variant]}>
      <div 
        className={variantStyles[variant]}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};

export default Content;