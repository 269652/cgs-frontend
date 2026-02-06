'use client';

import { useState } from "react";
import Image, { ImageProps } from "next/image";

type StrapiImageClientProps = ImageProps & {
  blurDataURL?: string;
  isSvg?: boolean;
};

export function StrapiImageClient({ blurDataURL, isSvg, ...props }: StrapiImageClientProps) {
  const [loaded, setLoaded] = useState(false);
  
  // Determine container sizing - if fill or className present, use flexible sizing
  const useFlexibleSize = props.fill || props.className?.includes('w-') || props.className?.includes('h-');
  
  return (
    <div className="relative" style={{ 
      display: useFlexibleSize ? 'block' : 'inline-block',
      width: useFlexibleSize ? '100%' : (props.width ? `${props.width}px` : 'auto'),
      height: useFlexibleSize ? '100%' : (props.height ? `${props.height}px` : 'auto'),
      overflow: 'hidden'
    }}>
      {/* PNG preview for SVGs (sharp, no blur) or blur placeholder for raster images */}
      {blurDataURL && (
        <div
          style={{
            position: 'absolute',
            top: isSvg ? '0' : '-2px',
            left: isSvg ? '0' : '-2px',
            right: isSvg ? '0' : '-2px',
            bottom: isSvg ? '0' : '-2px',
            backgroundImage: `url("${blurDataURL}")`,
            backgroundSize: props.style?.objectFit === 'contain' ? 'contain' : 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: isSvg ? 'none' : 'blur(4px)',
            opacity: loaded ? 0 : 1,
            transition: 'opacity 0.3s',
          }}
          aria-hidden="true"
        />
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
