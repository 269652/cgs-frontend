// SVG icons for contact info
export const contactIcons = {
  phone: `<svg class="inline-block w-4 h-4 mr-1 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>`,
  fax: `<svg class="inline-block w-4 h-4 mr-1 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd" /></svg>`,
  email: `<svg class="inline-block w-4 h-4 mr-1 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>`,
  address: `<svg class="inline-block w-4 h-4 mr-1 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>`,
};

// Regex patterns for contact detection
export const patterns = {
  phone: /^(Tel\.?:?\s*|Telefon:?\s*)([\d\s\-\+\(\)\/]+)$/i,
  fax: /^(Fax\.?:?\s*)([\d\s\-\+\(\)\/]+)$/i,
  email: /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
  address: /^([A-Za-zäöüßÄÖÜ\-\.\s]+(?:str\.|straße|weg|platz|gasse|allee)\.?\s+\d+[a-z]?,?\s+\d{5}\s+[A-Za-zäöüßÄÖÜ\s]+)$/i,
};

// Clean phone number for tel: links
export function cleanPhoneNumber(number: string): string {
  return number.replace(/[\s\-\(\)\/]/g, '');
}

// Generate Google Maps URL
export function getMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
}

// Link style classes
export const linkClass = "hover:text-green-600 dark:hover:text-green-400 transition-colors";

// Enhance HTML content with contact info links and icons
export function enhanceContactInfoHtml(html: string): string {
  let result = html;

  // Phone pattern: Tel.: or Tel: or Telefon: followed by numbers
  result = result.replace(
    /(?<!<a[^>]*>)(Tel\.?:?\s*|Telefon:?\s*)([\d\s\-\+\(\)\/]+)(?![^<]*<\/a>)/gi,
    (_, prefix, number) => {
      const cleanNumber = cleanPhoneNumber(number);
      return `${contactIcons.phone}<a href="tel:${cleanNumber}" class="${linkClass}">${prefix}${number}</a>`;
    }
  );

  // Fax pattern: Fax.: or Fax: followed by numbers
  result = result.replace(
    /(?<!<a[^>]*>)(Fax\.?:?\s*)([\d\s\-\+\(\)\/]+)(?![^<]*<\/a>)/gi,
    (_, prefix, number) => {
      const cleanNumber = cleanPhoneNumber(number);
      return `${contactIcons.fax}<a href="tel:${cleanNumber}" class="${linkClass}">${prefix}${number}</a>`;
    }
  );

  // Email pattern
  result = result.replace(
    /(?<!<a[^>]*href="[^"]*">)(?<!href="mailto:)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![^<]*<\/a>)/g,
    (_, email) => {
      return `${contactIcons.email}<a href="mailto:${email}" class="${linkClass}">${email}</a>`;
    }
  );

  // Address pattern: street with number, postal code, city (German format)
  result = result.replace(
    /(?<!<a[^>]*>)([A-Za-zäöüßÄÖÜ\-\.\s]+(?:str\.|straße|weg|platz|gasse|allee)\.?\s+\d+[a-z]?,?\s+\d{5}\s+[A-Za-zäöüßÄÖÜ\s]+)(?![^<]*<\/a>)/gi,
    (_, address) => {
      return `${contactIcons.address}<a href="${getMapsUrl(address)}" target="_blank" rel="noopener noreferrer" class="${linkClass}">${address}</a>`;
    }
  );

  return result;
}

// Detect contact type from a single line of text
export type ContactType = 'phone' | 'fax' | 'email' | 'address' | 'text';

export interface DetectedContact {
  type: ContactType;
  original: string;
  linkUrl?: string;
  prefix?: string;
  value?: string;
}

export function detectContactType(line: string): DetectedContact {
  const trimmed = line.trim();

  const phoneMatch = trimmed.match(patterns.phone);
  if (phoneMatch) {
    return {
      type: 'phone',
      original: trimmed,
      prefix: phoneMatch[1],
      value: phoneMatch[2],
      linkUrl: `tel:${cleanPhoneNumber(phoneMatch[2])}`,
    };
  }

  const faxMatch = trimmed.match(patterns.fax);
  if (faxMatch) {
    return {
      type: 'fax',
      original: trimmed,
      prefix: faxMatch[1],
      value: faxMatch[2],
      linkUrl: `tel:${cleanPhoneNumber(faxMatch[2])}`,
    };
  }

  if (patterns.email.test(trimmed)) {
    return {
      type: 'email',
      original: trimmed,
      linkUrl: `mailto:${trimmed}`,
    };
  }

  if (patterns.address.test(trimmed)) {
    return {
      type: 'address',
      original: trimmed,
      linkUrl: getMapsUrl(trimmed),
    };
  }

  return { type: 'text', original: trimmed };
}
