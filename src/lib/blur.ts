import sharp from "sharp";
import { imageLink } from "./imageLink";

const cache = new Map<string, string>();

export async function getBlurDataURL(src: string): Promise<string> {
  if (!src) return "";
  if (cache.has(src)) return cache.get(src)!;

  try {
    // Convert relative URLs to absolute URLs
    const absoluteUrl = imageLink(src);
    if (!absoluteUrl) return "";
    
    const isSvg = src.toLowerCase().endsWith('.svg');
    const res = await fetch(absoluteUrl);
    if (!res.ok) {
      console.warn(`[Blur] Failed to fetch image (${res.status}): ${absoluteUrl}`);
      return "";
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    
    // For SVG files, convert to PNG first then create blur
    let processBuffer: Buffer = buffer;
    if (isSvg) {
      try {
        // Convert SVG to PNG - sharp will respect the SVG's viewBox aspect ratio
        // We just set a max width, height will be calculated based on aspect ratio
        // Use transparent background
        const pngBuffer = await sharp(buffer)
          .resize(400, null, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        processBuffer = pngBuffer;
      } catch (svgError) {
        console.error(`[Blur] Failed to process SVG: ${src}`, svgError);
        return "";
      }
    }
    
    // Get original image dimensions
    const metadata = await sharp(processBuffer).metadata();
    const originalWidth = metadata.width || 512;
    const originalHeight = metadata.height || 512;
    
    // Calculate thumbnail size maintaining aspect ratio
    // Target max dimension of 256px
    const maxDimension = 256;
    let thumbWidth, thumbHeight;
    
    if (originalWidth > originalHeight) {
      thumbWidth = maxDimension;
      thumbHeight = Math.round((originalHeight / originalWidth) * maxDimension);
    } else {
      thumbHeight = maxDimension;
      thumbWidth = Math.round((originalWidth / originalHeight) * maxDimension);
    }
    
    // For SVGs, use PNG to preserve transparency; for raster images, use JPEG
    let tiny: Buffer;
    let dataURL: string;
    
    if (isSvg) {
      tiny = await sharp(processBuffer)
        .resize(thumbWidth, thumbHeight, { fit: "cover" })
        .png({ quality: 80 })
        .toBuffer();
      dataURL = `data:image/png;base64,${tiny.toString("base64")}`;
    } else {
      tiny = await sharp(processBuffer)
        .resize(thumbWidth, thumbHeight, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();
      dataURL = `data:image/jpeg;base64,${tiny.toString("base64")}`;
    }
    
    cache.set(src, dataURL);
    return dataURL;
  } catch (error) {
    console.error(`[Blur] Error generating blur for ${src}:`, error);
    return "";
  }
}
