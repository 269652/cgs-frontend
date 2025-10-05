import React from "react";

interface ImpressumProps {
  text: string;
}

const Impressum: React.FC<ImpressumProps> = ({ text }) => {
  const lines = text.split('\n').filter(line => line.trim());

  const detectAndLinkLine = (line: string) => {
    const trimmedLine = line.trim();
    
    // Address pattern: street number, postal code city
    const addressRegex = /^([A-Za-zäöüß\-\.\s]+\.?\s+\d+[a-z]?,?\s+\d{5}\s+[A-Za-zäöüß\s]+)$/i;
    
    // Phone pattern: Tel.: or Tel: followed by numbers, spaces, dashes
    const phoneRegex = /^(Tel\.?:?\s*)([\d\s\-\+\(\)\/]+)$/i;
    
    // Email pattern
    const emailRegex = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

    if (addressRegex.test(trimmedLine)) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmedLine)}`;
      return (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-300 dark:hover:text-gray-400 transition-colors"
          >
            {trimmedLine}
          </a>
        </div>
      );
    }

    if (phoneRegex.test(trimmedLine)) {
      const match = trimmedLine.match(phoneRegex);
      if (match) {
        const phoneNumber = match[2].replace(/\s/g, '').replace(/\-/g, '');
        const telUrl = `tel:${phoneNumber}`;
        return (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <a 
              href={telUrl}
              className="hover:text-gray-300 dark:hover:text-gray-400 transition-colors"
            >
              {trimmedLine}
            </a>
          </div>
        );
      }
    }

    if (emailRegex.test(trimmedLine)) {
      const mailtoUrl = `mailto:${trimmedLine}`;
      return (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <a 
            href={mailtoUrl}
            className="hover:text-gray-300 dark:hover:text-gray-400 transition-colors"
          >
            {trimmedLine}
          </a>
        </div>
      );
    }

    // If no pattern matches, return plain text
    return <div>{trimmedLine}</div>;
  };

  return (
    <div className="bg-gray-600 dark:bg-gray-700 text-white dark:text-gray-200 px-4 py-3 rounded text-sm shadow-md space-y-1">
      {lines.map((line, index) => (
        <div key={index}>
          {detectAndLinkLine(line)}
        </div>
      ))}
    </div>
  );
};

export default Impressum;