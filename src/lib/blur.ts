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
    if (isSvg) console.log(`[Blur] Fetching SVG for blur: ${absoluteUrl}`);
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
        console.log(`[Blur] Converting SVG to PNG: ${src}`);
        // Convert SVG to PNG - sharp will respect the SVG's viewBox aspect ratio
        // We just set a max width, height will be calculated based on aspect ratio
        // Use transparent background
        const pngBuffer = await sharp(buffer)
          .resize(400, null, { fit: "inside", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        processBuffer = pngBuffer;
        console.log(`[Blur] SVG converted to PNG successfully. PNG size: ${pngBuffer.length} bytes`);
      } catch (svgError) {
        console.error(`[Blur] Failed to process SVG: ${src}`, svgError);
        return "";
      }
    }
    
    // Get original image dimensions
    const metadata = await sharp(processBuffer).metadata();
    const originalWidth = metadata.width || 512;
    const originalHeight = metadata.height || 512;
    
    if (isSvg) console.log(`[Blur] Image dimensions: ${originalWidth}x${originalHeight} (from PNG conversion)`);
    
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
    
    if (isSvg) console.log(`[Blur] Creating thumbnail: ${thumbWidth}x${thumbHeight}`);
    
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
    if (isSvg) {
      console.log(`[Blur] Generated PNG preview for SVG: ${src.substring(0, 60)}... (${dataURL.length} chars, thumbnail: ${tiny.length} bytes)`);
    }
    return dataURL;
  } catch (error) {
    console.error(`[Blur] Error generating blur for ${src}:`, error);
    return "";
  }
}
