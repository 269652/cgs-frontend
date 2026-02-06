import Image, { ImageProps } from "next/image";
import { getBlurDataURL } from "@/lib/blur";

type StrapiImageProps = Omit<ImageProps, "placeholder" | "blurDataURL"> & {
  forceBlurDataURL?: string; // Allow passing pre-generated blur data
};

export default async function StrapiImage({ forceBlurDataURL, ...props }: StrapiImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const blurDataURL = forceBlurDataURL || await getBlurDataURL(src);

  // Determine container sizing - if fill or className present, use flexible sizing
  const useFlexibleSize = props.fill || props.className?.includes('w-') || props.className?.includes('h-');
  
  return (
    <div className="relative" style={{ 
      display: useFlexibleSize ? 'block' : 'inline-block',
      width: useFlexibleSize ? '100%' : (props.width ? `${props.width}px` : 'auto'),
      height: useFlexibleSize ? '100%' : (props.height ? `${props.height}px` : 'auto'),
      overflow: 'hidden'
    }}>
      {/* Blur placeholder background - embedded in static HTML */}
      {blurDataURL && (
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px', 
            right: '-2px',
            bottom: '-2px',
            backgroundImage: `url("${blurDataURL}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px)',
          }}
          aria-hidden="true"
        />
      )}
      <Image
        {...props}
        className={`relative z-10 ${props.className || ''}`}
        unoptimized
      />
    </div>
  );
}

