import React from "react";
import ImageGallery from "./ImageGallery";
import Teaser from "./Teaser";
import TripleTease from "./TripleTease";
import { imageLink } from "@/lib/imageLink";

const componentMap: Record<string, React.FC<any>> = {
  "image-gallery.image-gallery": ImageGallery,
  "teaser.teaser": Teaser,
  "triple-tease.triple-tease": TripleTease,
};

type SectionProps = {
  background: string;
  content: any[];
  bgImage?: any;
};

type GroupProps = {
  backgroundImage?: string | null;
  sections: Array<{
    background?: string | null;
    bgColor?: string | null;
    bgImage?: any;
    content?: any[];
  }>;
};

export const Section: React.FC<SectionProps> = ({
  background,
  content = [],
  bgImage,
}) => {
  return (
    <div
      className="h-[calc(100vh)] p-8 flex flex-col justify-center items-center"
      style={{
        background: background || undefined,
        borderRadius: "8px",
        backgroundImage: bgImage ? `url(${bgImage.url})` : undefined,
        backgroundSize: bgImage ? "cover" : undefined,
      }}
    >
      {content.map((cmp, idx) => {
        const Cmp = componentMap[cmp.__component];
        if (!Cmp) return null;
        if (cmp.__component === "image-gallery.image-gallery") {
          let images: { src: string; alt?: string }[] = [];
          if (Array.isArray(cmp.images)) {
            cmp.images.forEach((img: any) => {
              if (img?.file) {
                images.push({
                  src: imageLink(img.file.url),
                  alt: img?.alt || img.file.name,
                });
              }
            });
          }
          return <Cmp key={idx} {...cmp} images={images} autocycle={7} />;
        }
        if (cmp.__component === "teaser.teaser") {
          // Map Strapi teaser fields to Teaser props
          const teaserProps = {
            variant: cmp.variant,
            title: cmp.title,
            copy: cmp.copy,
            ctaLink: cmp.ctaLink,
            ctaLabel: cmp.ctaLabel,
            image:
              cmp.image && cmp.image.url
                ? {
                    src: imageLink(cmp.image.url),
                    alt: cmp.image.name || cmp.title,
                  }
                : undefined,
          };
          return <Cmp key={idx} {...teaserProps} />;
        }
        if (cmp.__component === "triple-tease.triple-tease") {
          // Map Strapi triple tease fields to TripleTease props
          const teasers = Array.isArray(cmp.teasers)
            ? cmp.teasers.map((teaser: any) => ({
                variant: teaser.variant,
                title: teaser.title,
                copy: teaser.copy,
                ctaLink: teaser.ctaLink,
                ctaLabel: teaser.ctaLabel,
                image:
                  teaser.image && teaser.image.url
                    ? {
                        src: imageLink(teaser.image.url),
                        alt: teaser.image.name || teaser.title,
                      }
                    : undefined,
              }))
            : [];
          return <Cmp key={idx} title={cmp.title} teasers={teasers} />;
        }
        return <Cmp key={idx} {...cmp} />;
      })}
    </div>
  );
};

const Group: React.FC<GroupProps> = ({ backgroundImage, sections }: any) => (
  <div
    className="w-screen max-h-screen"
    style={{
      backgroundImage: backgroundImage
        ? `url(${imageLink(backgroundImage.url)})`
        : undefined,
      backgroundSize: backgroundImage ? "cover" : undefined,
    }}
  >
    <div className="h-screen overflow-y-auto">
      {sections.map((section: any, idx: number) => (
        <Section
          key={idx}
          background={section.bgColor || section.background || "#FFF"}
          content={section.content || []}
          bgImage={section.bgImage}
        />
      ))}
    </div>
  </div>
);

export default Group;
