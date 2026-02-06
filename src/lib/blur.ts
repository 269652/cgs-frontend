import sharp from "sharp";

const cache = new Map<string, string>();

export async function getBlurDataURL(src: string): Promise<string> {
  if (!src) return "";
  // Skip SVG files - they don't need blur placeholders
  if (src.toLowerCase().endsWith('.svg')) return "";
  if (cache.has(src)) return cache.get(src)!;

  try {
    const res = await fetch(src);
    if (!res.ok) return "";
    const buffer = Buffer.from(await res.arrayBuffer());
    const tiny = await sharp(buffer)
      .resize(8, 8, { fit: "cover" })
      .jpeg({ quality: 20 })
      .toBuffer();
    const dataURL = `data:image/jpeg;base64,${tiny.toString("base64")}`;
    cache.set(src, dataURL);
    return dataURL;
  } catch {
    return "";
  }
}
