import React from "react";
import Image from "next/image";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import parse from "html-react-parser";
import ImageGallery from "./ImageGallery";

// Markdown copy renderer
const MarkdownCopy: React.FC<{ copy?: string; className?: string; style?: React.CSSProperties }> = async ({ copy, className, style }) => {
  if (!copy) return null;

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(copy);

  const htmlString = processedContent.toString();

  return (
    <div className={`teaser-copy ${className || ''}`} style={style}>
      {parse(htmlString)}
    </div>
  );
};

export type TeaserVariant =
  | "classic"
  | "modern"
  | "large"
  | "project"
  | "articleClassic"
  | "articleModern"
  | "text";
const TeaserText: React.FC<TeaserProps> = ({ title, ctaLink, ctaLabel }) => (
  <div
    className="h-[80%] w-[80%] items-center flex flex-col justify-between"
    style={{
      background: "transparent",
      padding: 0,
      margin: 0,
      textAlign: "left",
      width: "100%",
    }}
  >
    <h2
      className="text-white dark:text-gray-100"
      style={{
        fontSize: "3rem",
        fontWeight: 400,
        textShadow: "0 2px 8px #0008",
        margin: 0,
      }}
    >
      {title}
    </h2>
    {ctaLink && ctaLabel && (
      <a
        className="mt-auto w-fit bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
        href={ctaLink}
        style={{
          display: "inline-block",
          padding: "0.75rem 2rem",
          borderRadius: 6,
          fontWeight: 500,
          textDecoration: "none",
          marginTop: 8,
        }}
      >
        {ctaLabel}
      </a>
    )}
  </div>
);
const ArticleClassic: React.FC<TeaserProps> = ({
  title,
  images,
  image,
  copy,
  ctaLink,
  ctaLabel,
}) => (
  <div
    className="bg-[#fafafa] dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900 max-w-sm mx-auto p-6 flex flex-col items-center"
    style={{ width: "100%", textAlign: "center" }}
  >
    <div className="w-full mb-4 rounded-lg overflow-hidden">
      <TeaserImages images={images} image={image} title={title} className="rounded-lg" />
    </div>
    <h2
      className="text-gray-900 dark:text-gray-100"
      style={{
        fontSize: "clamp(1.25rem, 6vw, 1.5rem)",
        fontWeight: 500,
        margin: "0.5rem 0 1rem",
      }}
    >
      {title}
    </h2>
    <MarkdownCopy
      copy={copy}
      className="text-gray-700 dark:text-gray-300"
      style={{ fontSize: "clamp(1rem, 4vw, 1.1rem)", marginBottom: 16 }}
    />
    {ctaLink && ctaLabel && (
      <a
        className="mt-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        href={ctaLink}
        style={{
          display: "inline-block",
          textDecoration: "none",
          marginTop: 8,
        }}
      >
        {ctaLabel}
      </a>
    )}
  </div>
);

const ArticleModern: React.FC<TeaserProps> = ({
  title,
  images,
  image,
  copy,
  ctaLink,
  ctaLabel,
}) => (
  <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg dark:shadow-gray-900 max-w-sm mx-auto p-6 flex flex-col items-center w-full">
    <div className="w-full mb-4 rounded-lg overflow-hidden">
      <TeaserImages images={images} image={image} title={title} className="rounded-lg" />
    </div>
    <h2
      className="font-bold mb-2 text-gray-900 dark:text-gray-100 text-center"
      style={{ fontSize: "clamp(1.25rem, 6vw, 1.5rem)" }}
    >
      {title}
    </h2>
    <MarkdownCopy
      copy={copy}
      className="text-gray-700 dark:text-gray-300 mb-4 text-center"
      style={{ fontSize: "clamp(1rem, 4vw, 1.1rem)" }}
    />
    {ctaLink && ctaLabel && (
      <a
        href={ctaLink}
        className="inline-block bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow dark:shadow-gray-900 transition font-semibold w-fit mt-2"
      >
        {ctaLabel}
      </a>
    )}
  </div>
);

export interface TeaserProps {
  variant?: TeaserVariant;
  title: string;
  images?: { src: string; alt?: string; width?: number; height?: number }[];
  image?: { src: string; alt?: string; width?: number; height?: number }; // Backward compatibility
  copy?: string;
  ctaLink?: string;
  ctaLabel?: string;
  className?: string;
}

// Helper component to render images - uses ImageGallery for multiple, single Image for one
const TeaserImages: React.FC<{
  images?: TeaserProps['images'];
  image?: TeaserProps['image']; // Backward compatibility
  title: string;
  className?: string
}> = ({ images, image, title, className }) => {
  // Normalize: use images array, or fallback to single image wrapped in array
  const normalizedImages = images && images.length > 0
    ? images
    : image
      ? [image]
      : [];

  if (normalizedImages.length === 0) return null;

  // Single image - use simple Image component (old behavior)
  if (normalizedImages.length === 1) {
    const img = normalizedImages[0];
    return (
      <Image
        src={img.src}
        alt={img.alt || title}
        width={img.width || 400}
        height={img.height || 300}
        className={className}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "auto",
        }}
      />
    );
  }

  // Multiple images - use ImageGallery with slider
  return (
    <ImageGallery
      images={normalizedImages}
      variant="slider"
      displayVariant="inline"
      autocycle={5}
    />
  );
};

const TeaserClassic: React.FC<TeaserProps> = ({
  title,
  images,
  image,
  copy,
  ctaLink,
  ctaLabel,
  className,
}) => (
  <div
    style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}
    className={`flex flex-col items-center h-full  ${className}`}
  >
    <h2 style={{ fontSize: "2rem", fontWeight: 400, margin: "2rem 0 0.5rem" }}>
      {title}
    </h2>
    {images && images.length > 0 && (
      <div className="w-full max-w-[200px] rounded-lg overflow-hidden my-4">
        <TeaserImages images={images} image={image} title={title} className="rounded-lg" />
      </div>
    )}
    <MarkdownCopy
      copy={copy}
      className="text-gray-700 dark:text-gray-300"
    />
    <span className="flex-1 grow"></span>
    {ctaLink && ctaLabel && (
      <a
        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white mt-auto"
        href={ctaLink}
        style={{
          display: "inline-block",
          padding: "0.75rem 2rem",
          borderRadius: 6,
          fontWeight: 500,
          textDecoration: "none",
          marginTop: 16,
        }}
      >
        {ctaLabel}
      </a>
    )}
  </div>
);

const TeaserModern: React.FC<TeaserProps> = ({
  title,
  images,
  image,
  copy,
  ctaLink,
  ctaLabel,
}) => (
  <div className="relative flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg dark:shadow-gray-900 overflow-hidden max-w-3xl mx-auto my-8 w-full">
    {/* Mobile: image on top, text below */}
    <div className="w-full md:w-1/2 relative mb-4 md:mb-0 overflow-hidden">
      <TeaserImages images={images} image={image} title={title} />
    </div>
    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
      <h2
        className="font-bold mb-2 text-gray-900 dark:text-gray-100"
        style={{ fontSize: "clamp(1.5rem, 7vw, 2rem)" }}
      >
        {title}
      </h2>
      <MarkdownCopy
        copy={copy}
        className="text-gray-700 dark:text-gray-300 mb-4"
        style={{ fontSize: "clamp(1rem, 4vw, 1.1rem)" }}
      />
      {ctaLink && ctaLabel && (
        <a
          href={ctaLink}
          className="inline-block bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow dark:shadow-gray-900 transition font-semibold w-fit mt-2"
        >
          {ctaLabel}
        </a>
      )}
    </div>
  </div>
);

const TeaserLarge: React.FC<TeaserProps> = ({
  title,
  images,
  image,
  copy,
  ctaLink,
  ctaLabel,
}) => (
  <div
    style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}
    className="flex flex-col items-center"
  >
    <h2
      className="text-gray-900 dark:text-gray-100"
      style={{ fontSize: "2rem", fontWeight: 400, margin: "2rem 0 0.5rem" }}
    >
      {title}
    </h2>
    {images && images.length > 0 && (
      <div className="w-full rounded-lg overflow-hidden my-4">
        <TeaserImages images={images} image={image} title={title} className="rounded-lg" />
      </div>
    )}
    <MarkdownCopy
      copy={copy}
      className="text-gray-700 dark:text-gray-300"
      style={{ margin: "1.5rem 0", fontSize: "1rem" }}
    />
    <span className="flex-1"></span>
    {ctaLink && ctaLabel && (
      <a
        className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white mt-auto"
        href={ctaLink}
        style={{
          display: "inline-block",
          padding: "0.75rem 2rem",
          borderRadius: 6,
          fontWeight: 500,
          textDecoration: "none",
          marginTop: 16,
        }}
      >
        {ctaLabel}
      </a>
    )}
  </div>
);

// Project teaser - modern card style for showcasing projects
const TeaserProject: React.FC<TeaserProps> = ({
  title,
  images,
  image,
  copy,
  ctaLink,
  ctaLabel,
  className,
}) => (
  <article
    className={`group  dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/70 transition-all duration-300 flex flex-col h-full border border-black shadow-sm ${className || ''}`}
  >
    {/* Image section */}
    {images && images.length > 0 && (
      <div className="relative overflow-hidden">
        <TeaserImages images={images} image={image} title={title} className="w-full h-full object-cover" />
      </div>
    )}

    {/* Content section */}
    <div className="p-5 flex flex-col flex-1">
      {/* Title */}
      <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors line-clamp-2">
        {ctaLink ? (
          <a href={ctaLink} className="hover:underline">
            {title}
          </a>
        ) : (
          title
        )}
      </h3>

      {/* Description */}
      {copy && (
        <MarkdownCopy
          copy={copy}
          className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 flex-1 max-w-[270px]"
        />
      )}

      {/* CTA Button */}
      {ctaLink && ctaLabel && (
        <div className="mt-auto pt-2">
          <a
            href={ctaLink}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            {ctaLabel}
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  </article>
);

const variantMap: Record<TeaserVariant, React.FC<TeaserProps>> = {
  classic: TeaserClassic,
  modern: TeaserModern,
  large: TeaserLarge,
  project: TeaserProject,
  articleClassic: ArticleClassic,
  articleModern: ArticleModern,
  text: TeaserText,
};

const Teaser: React.FC<TeaserProps> = (props) => {
  const Variant = variantMap[props.variant || "classic"];
  return <Variant {...props} />;
};

export default Teaser;
