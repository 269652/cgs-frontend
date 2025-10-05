import React from "react";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";

interface ContentProps {
  content: string; // Markdown content
  variant?: 'default' | 'dark';
  title?: string;
}

const Content: React.FC<ContentProps> = async ({ content, variant = 'default', title }) => {
  // Process markdown on server with HTML support
  const processedContent = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown support
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert markdown to HTML AST
    .use(rehypeRaw) // Parse raw HTML in markdown
    .use(rehypeStringify) // Convert HTML AST to string
    .process(content);
  
  const htmlContent = processedContent.toString();

  // Define variant styles
  const variantStyles = {
    default: 'content-body',
    dark: 'content-body-dark'
  };

  const containerStyles = {
    default: 'max-w-full font-sans leading-relaxed text-gray-700 dark:text-gray-300 p-2 md:px-8',
    dark: 'max-w-full font-sans leading-relaxed text-gray-100 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 p-8 rounded-lg mt-8'
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