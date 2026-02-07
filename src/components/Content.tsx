import React, { ReactNode } from "react";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import parse, { DOMNode, domToReact, HTMLReactParserOptions, Element, Text } from "html-react-parser";

interface ContentProps {
  content: string;
  variant?: 'default' | 'dark';
  title?: string;
}

// Icon components
const PhoneIcon = () => (
  <svg className="inline-block w-4 h-4 mr-1 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const FaxIcon = () => (
  <svg className="inline-block w-4 h-4 mr-1 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
  </svg>
);

const EmailIcon = () => (
  <svg className="inline-block w-4 h-4 mr-1 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const AddressIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-4 h-4 text-gray-600 dark:text-gray-300 ${className}`} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

// Pattern definitions for text matching
const patterns = {
  phone: /^(Tel\.?:\s*|Telefon:?\s*|Mobil:?\s*)([\d\s\-\+\(\)\/]+)$/i,
  fax: /^(Fax\.?:\s*)([\d\s\-\+\(\)\/]+)$/i,
  email: /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
  // Address: organization is optional, captures street + postal/city (stops before phone/email/end)
  address: /(?:Kontakt:\s*\n+\s*)?(?:(.+?)\s*\n+\s*)?(.+?\s+\d+[a-z]?)\s*\n+\s*(\d{5}\s+.+?)(?=\s*$|\s*\n\s*(?:Tel|Fax|Mobil|\S+@\S+|\n))/im,
};

// Extract text content from DOM nodes (ignoring HTML tags like <br>)
function getTextContent(nodes: DOMNode[]): string {
  let text = '';
  for (const node of nodes) {
    if (node.type === 'text') {
      text += (node as Text).data;
    } else if (node.type === 'tag') {
      const element = node as Element;
      if (element.name === 'br') {
        text += '\n'; // Replace <br> with newline for address matching
      } else if (element.children) {
        text += getTextContent(element.children as DOMNode[]);
      }
    }
  }
  return text;
}

// Check if an element contains only text and br tags (no other elements)
function isSimpleTextElement(element: Element): boolean {
  if (!element.children) return false;
  for (const child of element.children) {
    if (child.type === 'tag') {
      const tagElement = child as Element;
      if (tagElement.name !== 'br') {
        return false;
      }
    }
  }
  return true;
}

// Check if text matches any contact pattern and return enhanced content
function enhanceText(text: string): ReactNode {
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Phone
  const phoneMatch = trimmed.match(patterns.phone);
  if (phoneMatch) {
    const [, prefix, number] = phoneMatch;
    const cleanNumber = number.replace(/[\s\-\(\)\/]/g, '');
    return (
      <>
        <PhoneIcon />
        <a href={`tel:${cleanNumber}`} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
          {prefix}{number}
        </a>
      </>
    );
  }

  // Fax
  const faxMatch = trimmed.match(patterns.fax);
  if (faxMatch) {
    const [, prefix, number] = faxMatch;
    const cleanNumber = number.replace(/[\s\-\(\)\/]/g, '');
    return (
      <>
        <FaxIcon />
        <a href={`tel:${cleanNumber}`} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
          {prefix}{number}
        </a>
      </>
    );
  }

  // Email
  const emailMatch = trimmed.match(patterns.email);
  if (emailMatch) {
    const email = emailMatch[1];
    return (
      <>
        <EmailIcon />
        <a href={`mailto:${email}`} className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
          {email}
        </a>
      </>
    );
  }

  // Address
  const addressMatch = trimmed.match(patterns.address);
  if (addressMatch) {
    const [, name, street, postalCode, city] = addressMatch;
    // Use the full matched text for the search query
    const fullAddress = `${street} ${postalCode} ${city}`.trim();
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
    return (
      <>
        <AddressIcon />
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
          {trimmed}
        </a>
      </>
    );
  }

  return text;
}

// Custom replace function for html-react-parser
function createParserOptions(parentIsLink: boolean = false): HTMLReactParserOptions {
  return {
    replace: (domNode: DOMNode) => {
      // Handle anchor tags - add email icon if mailto link
      if (domNode.type === 'tag') {
        const element = domNode as Element;

        if (element.name === 'a') {
          const href = element.attribs?.href || '';

          // If it's a mailto link, add email icon
          if (href.startsWith('mailto:')) {
            const children = domToReact(element.children as DOMNode[], createParserOptions(true));
            return (
              <>
                <EmailIcon />
                <a
                  {...element.attribs}
                  className={`${element.attribs?.class || ''} hover:text-green-600 dark:hover:text-green-400 transition-colors`.trim()}
                >
                  {children}
                </a>
              </>
            );
          }

          // For other links, just pass through with children processed (but mark as in-link)
          const children = domToReact(element.children as DOMNode[], createParserOptions(true));
          return (
            <a {...element.attribs}>
              {children}
            </a>
          );
        }

        // Check for address patterns - detect any address in text/markdown content
        if (!parentIsLink && element.children) {
          const textContent = getTextContent(element.children as DOMNode[]).trim();
          
          // Look for address pattern in any text content (check for postal code as indicator)
          if (/\d{5}/.test(textContent)) {
            const addressMatch = textContent.match(patterns.address);

            if (addressMatch) {
              const [fullMatch, organization, street, postalCity] = addressMatch;
              // Use full address for Google Maps - organization is optional
              const fullAddress = organization
                ? `${organization}, ${street}, ${postalCity}`.trim()
                : `${street}, ${postalCity}`.trim();
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

              // The first address line gets the icon (org if present, otherwise street)
              const iconLine = organization || street;

              // Process children with both phone/email and address enhancements
              const enhancedChildren = domToReact(element.children as DOMNode[], {
                replace: (domNode) => {
                  if (domNode.type === 'text') {
                    const textNode = domNode as Text;
                    const text = textNode.data.trim();

                    // First check if this text has phone/email patterns
                    const enhanced = enhanceText(text);
                    if (enhanced !== text) {
                      return <>{enhanced}</>; // Return phone/email enhancement
                    }

                    // First address line gets the icon
                    if (text === iconLine) {
                      return (
                        <span className="inline-flex items-start">
                          <AddressIcon className="flex-shrink-0 w-4 h-4 mr-2 mt-1" />
                          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
                            {text}
                          </a>
                        </span>
                      );
                    } else if (text === street || text === postalCity) {
                      return (
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 dark:hover:text-green-400 transition-colors ml-6">
                          {text}
                        </a>
                      );
                    }
                  }
                  return undefined; // Let default processing handle other nodes
                }
              });

              return React.createElement(element.name, element.attribs, enhancedChildren);
            }
          }
        }
      }

      // Handle text nodes - only enhance if not inside a link
      if (domNode.type === 'text' && !parentIsLink) {
        const textNode = domNode as Text;
        const text = textNode.data;
        const enhanced = enhanceText(text);

        // Only return if we actually enhanced the text
        if (enhanced !== text) {
          return <>{enhanced}</>;
        }
      }

      // Return undefined to let the default behavior handle it
      return undefined;
    }
  };
}

const Content: React.FC<ContentProps> = async ({ content, variant = 'default', title }) => {
  // Process markdown on server with HTML support
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(content);

  const htmlString = processedContent.toString();

  // Parse HTML and enhance contact info
  const enhancedContent = parse(htmlString, createParserOptions());

  // Define variant styles
  const variantStyles = {
    default: 'content-body',
    dark: 'content-body-dark'
  };

  const containerStyles = {
    default: 'max-w-full font-sans leading-relaxed text-gray-700 dark:text-gray-300 bg-background p-2 md:px-8',
    dark: 'max-w-full font-sans leading-relaxed text-gray-100 dark:text-gray-200 bg-gray-100 bg-background px-8 py-1 rounded-lg mt-8'
  };

  return (
    <div className={containerStyles[variant]}>
      <div className={variantStyles[variant]}>
        {enhancedContent}
      </div>
    </div>
  );
};

export default Content;
