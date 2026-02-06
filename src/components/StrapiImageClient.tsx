'use client';

import { useState } from "react";
import Image, { ImageProps } from "next/image";

type StrapiImageClientProps = ImageProps & {
  blurDataURL?: string;
  isSvg?: boolean;
};

export function StrapiImageClient({ blurDataURL, isSvg, ...props }: StrapiImageClientProps) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative overflow-hidden" style={{ display: 'inline-block', width: '100%', height: '100%' }}>
      {/* PNG preview for SVGs (sharp, no blur) or blur placeholder for raster images */}
      {blurDataURL && (
        <div
          className="absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-300"
          style={{ opacity: loaded ? 0 : 1 }}
          aria-hidden="true"
        >
          <div
            style={{
              position: 'absolute',
              inset: isSvg ? '0' : '-2px', // Extend by half the blur radius for blurred images
              backgroundImage: `url("${blurDataURL}")`,
              backgroundSize: props.style?.objectFit === 'contain' ? 'contain' : 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: isSvg ? 'none' : 'blur(4px)',
            }}
          />
        </div>
      )}
      <Image
        {...props}
        className={`relative z-10 ${props.className || ''}`}
        onLoad={() => setLoaded(true)}
        unoptimized
      />
    </div>
  );
}
