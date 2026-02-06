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
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url("${blurDataURL}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)',
            transform: 'scale(1.1)',
          }}
          aria-hidden="true"
        />
      )}
      <Image
        {...props}
        className={`relative z-10 ${props.className || ''}`}
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL || undefined}
      />
    </div>
  );
}

// Client-side version that accepts blur data as prop
export function StrapiImageClient(props: ImageProps & { blurDataURL?: string }) {
  const { blurDataURL, ...imageProps } = props;
  
  return (
    <div className="relative overflow-hidden" style={{ display: 'inline-block', width: '100%', height: '100%' }}>
      {/* Blur placeholder background - embedded in static HTML */}
      {blurDataURL && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url("${blurDataURL}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)',
            transform: 'scale(1.1)',
          }}
          aria-hidden="true"
        />
      )}
      <Image
        {...imageProps}
        className={`relative z-10 ${imageProps.className || ''}`}
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL || undefined}
      />
    </div>
  );
}
