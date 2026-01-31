import React from "react";
import Image from "next/image";

export type TeaserVariant =
  | "classic"
  | "modern"
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
  image,
  copy,
  ctaLink,
  ctaLabel,
}) => (
  <div
    className="bg-[#fafafa] dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-900 max-w-sm mx-auto p-6 flex flex-col items-center"
    style={{ width: "100%", textAlign: "center" }}
  >
    <div
      className="w-full mb-4"
      style={{ display: "flex", justifyContent: "center" }}
    >
      {image && (
        <Image
          src={image?.src}
          alt={image?.alt || title}
          width={image?.width || 320}
          height={image?.height || 180}
          style={{
            borderRadius: 8,
            objectFit: "cover",
            width: "100%",
            height: "auto",
            maxHeight: "220px",
          }}
        />
      )}
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
    <p
      className="text-gray-700 dark:text-gray-300"
      style={{ fontSize: "clamp(1rem, 4vw, 1.1rem)", marginBottom: 16 }}
    >
      {copy}
    </p>
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
  image,
  copy,
  ctaLink,
  ctaLabel,
}) => (
  <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg dark:shadow-gray-900 max-w-sm mx-auto p-6 flex flex-col items-center w-full">
    <div className="w-full mb-4 flex justify-center">
      <Image
        src={image?.src}
        alt={image?.alt || title}
        width={image?.width || 320}
        height={image?.height || 180}
        style={{
          borderRadius: 8,
          objectFit: "cover",
          width: "100%",
          height: "auto",
          maxHeight: "220px",
        }}
      />
    </div>
    <h2
      className="font-bold mb-2 text-gray-900 dark:text-gray-100 text-center"
      style={{ fontSize: "clamp(1.25rem, 6vw, 1.5rem)" }}
    >
      {title}
    </h2>
    <p
      className="text-gray-700 dark:text-gray-300 mb-4 text-center"
      style={{ fontSize: "clamp(1rem, 4vw, 1.1rem)" }}
    >
      {copy}
    </p>
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
  image: { src: string; alt?: string; width?: number; height?: number };
  copy: string;
  ctaLink?: string;
  ctaLabel?: string;
}

const TeaserClassic: React.FC<TeaserProps> = ({
  title,
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
    {image && (
      <Image
        src={image?.src}
        alt={image?.alt || title}
        width={image.width || 379}
        height={248}
        style={{ height: "248px", borderRadius: 8, margin: "1rem auto" }}
      />
    )}
    <p
      className="text-gray-700 dark:text-gray-300"
      style={{ margin: "1.5rem 0", fontSize: "1rem" }}
    >
      {copy}
    </p>
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

const TeaserModern: React.FC<TeaserProps> = ({
  title,
  image,
  copy,
  ctaLink,
  ctaLabel,
}) => (
  <div className="relative flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg dark:shadow-gray-900 overflow-hidden max-w-3xl mx-auto my-8 w-full">
    {/* Mobile: image on top, text below */}
    <div className="w-full md:w-1/2 relative mb-4 md:mb-0 md:h-screen flex justify-center">
      <Image
        src={image?.src}
        alt={image?.alt || title}
        width={image?.width || 700}
        height={image?.height || 800}
        style={{
          borderRadius: 8,
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
      <h2
        className="font-bold mb-2 text-gray-900 dark:text-gray-100"
        style={{ fontSize: "clamp(1.5rem, 7vw, 2rem)" }}
      >
        {title}
      </h2>
      <p
        className="text-gray-700 dark:text-gray-300 mb-4"
        style={{ fontSize: "clamp(1rem, 4vw, 1.1rem)" }}
      >
        {copy}
      </p>
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

const variantMap: Record<TeaserVariant, React.FC<TeaserProps>> = {
  classic: TeaserClassic,
  modern: TeaserModern,
  articleClassic: ArticleClassic,
  articleModern: ArticleModern,
  text: TeaserText,
};

const Teaser: React.FC<TeaserProps> = (props) => {
  const Variant = variantMap[props.variant || "classic"];
  return <Variant {...props} />;
};

export default Teaser;
