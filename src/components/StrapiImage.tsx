import Image, { ImageProps } from "next/image";
import { getBlurDataURL } from "@/lib/blur";

type StrapiImageProps = Omit<ImageProps, "placeholder" | "blurDataURL"> & {
  forceBlurDataURL?: string; // Allow passing pre-generated blur data
};

export default async function StrapiImage({ forceBlurDataURL, ...props }: StrapiImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const blurDataURL = forceBlurDataURL || await getBlurDataURL(src);

  return (
    <div className="relative overflow-hidden" style={{ display: 'inline-block', width: '100%', height: '100%' }}>
      {/* Blur placeholder background - embedded in static HTML */}
      {blurDataURL && (
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          aria-hidden="true"
        >
          <div
            style={{
              position: 'absolute',
              inset: '-2px', // Extend by half the blur radius (4px / 2 = 2px)
              backgroundImage: `url("${blurDataURL}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(4px)',
            }}
          />
        </div>
      )}
      <Image
        {...props}
        className={`relative z-10 ${props.className || ''}`}
        unoptimized
      />
    </div>
  );
}

