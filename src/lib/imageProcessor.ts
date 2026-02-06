import { getBlurDataURL } from "./blur";

export interface ProcessedImage {
  url: string;
  name?: string;
  blurDataURL?: string;
  isSvg?: boolean;
}

/**
 * Process images by adding blur data URLs for progressive loading
 * This enables proper no-JS fallback with inlined low-quality placeholders
 */
export async function processImagesWithBlur(
  images: Array<{ url: string; name?: string } | undefined | null> | undefined | null
): Promise<ProcessedImage[]> {
  if (!images || images.length === 0) return [];

  const validImages = images.filter((img): img is { url: string; name?: string } => 
    img != null && typeof img.url === 'string' && img.url.length > 0
  );

  const processedImages = await Promise.all(
    validImages.map(async (img) => {
      try {
        const isSvg = img.url.toLowerCase().endsWith('.svg');
        const blurDataURL = await getBlurDataURL(img.url);
        return {
          url: img.url,
          name: img.name,
          blurDataURL,
          isSvg,
        };
      } catch (error) {
        console.warn(`Failed to generate blur data for image: ${img.url}`, error);
        return {
          url: img.url,
          name: img.name,
        };
      }
    })
  );

  return processedImages;
}

/**
 * Process a single image with blur data
 */
export async function processImageWithBlur(
  image: { url: string; name?: string } | undefined | null
): Promise<ProcessedImage | null> {
  if (!image || !image.url) return null;

  try {
    const isSvg = image.url.toLowerCase().endsWith('.svg');
    const blurDataURL = await getBlurDataURL(image.url);
    return {
      url: image.url,
      name: image.name,
      blurDataURL,
      isSvg,
    };
  } catch (error) {
    console.warn(`Failed to generate blur data for image: ${image.url}`, error);
    return {
      url: image.url,
      name: image.name,
    };
  }
}
