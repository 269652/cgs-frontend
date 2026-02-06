import Image, { ImageProps } from "next/image";
import { getBlurDataURL } from "@/lib/blur";

type StrapiImageProps = Omit<ImageProps, "placeholder" | "blurDataURL"> & {
  forceBlurDataURL?: string; // Allow passing pre-generated blur data
};

export default async function StrapiImage({ forceBlurDataURL, ...props }: StrapiImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const blurDataURL = forceBlurDataURL || await getBlurDataURL(src);

  return (
    <Image
      {...props}
      placeholder={blurDataURL ? "blur" : undefined}
      blurDataURL={blurDataURL || undefined}
    />
  );
}

// Client-side version that accepts blur data as prop
export function StrapiImageClient(props: ImageProps) {
  return <Image {...props} />;
}
