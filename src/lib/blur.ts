import sharp from "sharp";
import { imageLink } from "./imageLink";

const cache = new Map<string, string>();

export async function getBlurDataURL(src: string): Promise<string> {
  if (!src) return "";
  // Skip SVG files - they don't need blur placeholders
  if (src.toLowerCase().endsWith('.svg')) return "";
  if (cache.has(src)) return cache.get(src)!;

  try {
    // Convert relative URLs to absolute URLs
    const absoluteUrl = imageLink(src);
    if (!absoluteUrl) return "";
    
    console.log(`[Blur] Fetching image for blur: ${absoluteUrl}`);
    const res = await fetch(absoluteUrl);
    if (!res.ok) {
      console.warn(`[Blur] Failed to fetch image (${res.status}): ${absoluteUrl}`);
      return "";
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const tiny = await sharp(buffer)
      .resize(8, 8, { fit: "cover" })
      .jpeg({ quality: 20 })
      .toBuffer();
    const dataURL = `data:image/jpeg;base64,${tiny.toString("base64")}`;
    cache.set(src, dataURL);
    console.log(`[Blur] Generated blur for: ${src.substring(0, 60)}... (${dataURL.length} chars)`);
    return dataURL;
  } catch (error) {
    console.error(`[Blur] Error generating blur for ${src}:`, error);
    return "";
  }
}
