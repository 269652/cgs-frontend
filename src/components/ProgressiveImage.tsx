import Image, { ImageProps } from "next/image";

/**
 * Progressive Image component that works without JavaScript
 * Shows a blurred low-quality placeholder that's inlined in the HTML
 * The blur is visible even when JS is disabled
 */
export default function ProgressiveImage({ 
  blurDataURL, 
  alt = "",
  className = "",
  style = {},
  ...props 
}: ImageProps) {
  if (!blurDataURL) {
    return <Image {...props} alt={alt} className={className} style={style} />;
  }

  return (
    <div 
      className={`relative ${className}`}
      style={{
        ...style,
        backgroundImage: `url("${blurDataURL}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Image
        {...props}
        alt={alt}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className="relative z-10"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
