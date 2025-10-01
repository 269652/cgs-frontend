import React from "react";
import Image from "next/image";

export type TeaserVariant = "classic" | "modern" | "articleClassic" | "articleModern" | "text";
const TeaserText: React.FC<TeaserProps> = ({ title, ctaLink, ctaLabel }) => (
  <div className="h-[80%] w-[80%] items-center  flex flex-col justify-between" style={{ background: 'transparent', padding: 0, margin: 0, textAlign: 'left', width: '100%' }}>
    <h2 style={{ fontSize: '3rem', fontWeight: 400, color: '#fff', textShadow: '0 2px 8px #0008', margin: 0 }}>{title}</h2>
        {ctaLink && ctaLabel && (
      <a className="mt-auto w-fit" href={ctaLink} style={{ display: 'inline-block', background: '#39d100', color: '#fff', padding: '0.75rem 2rem', borderRadius: 6, fontWeight: 500, textDecoration: 'none', marginTop: 8 }}>{ctaLabel}</a>
    )}
  </div>
);
const ArticleClassic: React.FC<TeaserProps> = ({ title, image, copy, ctaLink, ctaLabel }) => (
  <div
    className="bg-[#fafafa] rounded-xl shadow max-w-sm mx-auto p-6 flex flex-col items-center"
    style={{ width: '100%', textAlign: 'center' }}
  >
    <div className="w-full mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
      <Image
        src={image?.src}
        alt={image?.alt || title}
        width={image?.width || 320}
        height={image?.height || 180}
        style={{ borderRadius: 8, objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '220px' }}
      />
    </div>
    <h2 style={{ fontSize: 'clamp(1.25rem, 6vw, 1.5rem)', fontWeight: 500, margin: '0.5rem 0 1rem', color: '#222' }}>{title}</h2>
    <p style={{ fontSize: 'clamp(1rem, 4vw, 1.1rem)', color: '#222', marginBottom: 16 }}>{copy}</p>
    {ctaLink && ctaLabel && (
      <a className="mt-2" href={ctaLink} style={{ display: 'inline-block', background: '#39d100', color: '#fff', padding: '0.75rem 2rem', borderRadius: 6, fontWeight: 500, textDecoration: 'none', marginTop: 8 }}>{ctaLabel}</a>
    )}
  </div>
);

const ArticleModern: React.FC<TeaserProps> = ({ title, image, copy, ctaLink, ctaLabel }) => (
  <div className="bg-white rounded-xl shadow-lg max-w-sm mx-auto p-6 flex flex-col items-center w-full">
    <div className="w-full mb-4 flex justify-center">
      <Image
        src={image?.src}
        alt={image?.alt || title}
        width={image?.width || 320}
        height={image?.height || 180}
        style={{ borderRadius: 8, objectFit: 'cover', width: '100%', height: 'auto', maxHeight: '220px' }}
      />
    </div>
    <h2 className="font-bold mb-2 text-gray-900 text-center" style={{ fontSize: 'clamp(1.25rem, 6vw, 1.5rem)' }}>{title}</h2>
    <p className="text-gray-700 mb-4 text-center" style={{ fontSize: 'clamp(1rem, 4vw, 1.1rem)' }}>{copy}</p>
    {ctaLink && ctaLabel && (
      <a href={ctaLink} className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition font-semibold w-fit mt-2">{ctaLabel}</a>
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

const TeaserClassic: React.FC<TeaserProps> = ({ title, image, copy, ctaLink, ctaLabel }) => (
  <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
    <h2 style={{ fontSize: "2rem", fontWeight: 400, margin: "2rem 0 0.5rem" }}>{title}</h2>
    <Image src={image?.src} alt={image?.alt || title} width={image.width || 700} height={image.height || 400} style={{ borderRadius: 8, margin: "1rem auto" }} />
    <p style={{ margin: "1.5rem 0", fontSize: "1rem", color: "#333" }}>{copy}</p>
    {ctaLink && ctaLabel && (
      <a href={ctaLink} style={{ display: "inline-block", background: "#39d100", color: "#fff", padding: "0.75rem 2rem", borderRadius: 6, fontWeight: 500, textDecoration: "none", marginTop: 16 }}>{ctaLabel}</a>
    )}
  </div>
);

const TeaserModern: React.FC<TeaserProps> = ({ title, image, copy, ctaLink, ctaLabel }) => (
  <div className="relative flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden max-w-3xl mx-auto my-8 w-full">
    {/* Mobile: image on top, text below */}
    <div className="w-full md:w-1/2 relative mb-4 md:mb-0 md:h-screen flex justify-center">
      <Image
        src={image?.src}
        alt={image?.alt || title}
        width={image?.width || 700}
        height={image?.height || 800}
        style={{ borderRadius: 8, objectFit: 'cover', width: '100%', height: '100%'}}
      />
    </div>
    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
      <h2 className="font-bold mb-2 text-gray-900" style={{ fontSize: 'clamp(1.5rem, 7vw, 2rem)' }}>{title}</h2>
      <p className="text-gray-700 mb-4" style={{ fontSize: 'clamp(1rem, 4vw, 1.1rem)' }}>{copy}</p>
      {ctaLink && ctaLabel && (
        <a href={ctaLink} className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition font-semibold w-fit mt-2">{ctaLabel}</a>
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
