import React from "react";
import ImageGallery from "./ImageGallery";
import Teaser from "./Teaser";
import TripleTease from "./TripleTease";
import Content from "./Content";
import { imageLink } from "@/lib/imageLink";
import Header from "./Header";
import { NavigationCategory } from "@/types/navigation";
import Image from "next/image";

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

export type GroupProps = {
  title?: string;
  backgroundImage?: string | { url: string } | null;
  content?: Array<{
    content: string; // Markdown content to be processed
    variant?: "default" | "dark";
    title?: string;
  }>;
  sections?: Array<{
    background?: string | null;
    bgColor?: string | null;
    bgImage?: any;
    content?: any[];
  }>;
  header?: any;
  navigation?: NavigationCategory[];
};

export const Section: React.FC<SectionProps> = ({
  background,
  content = [],
  bgImage,
}) => {
  return (
    <div
      className="min-h-ful min-h-screen  flex flex-col justify-center items-center relative p-2 md:p-8"
      style={{
        background,
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
          return <Cmp key={idx} {...cmp} images={images} autocycle={7} variant="inline" />;
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

const Group: React.FC<GroupProps> = async ({
  title,
  backgroundImage,
  content,
  sections,
  header,
  navigation,
}) => {
  const getBackgroundImageUrl = () => {
    if (!backgroundImage) return undefined;
    if (typeof backgroundImage === "string") return backgroundImage;
    return imageLink(backgroundImage.url);
  };

  return (
    <div className="w-full">
      {backgroundImage && (
        <div className="fixed inset-0 -z-1 h-screen top-0">
          <Image
            src={getBackgroundImageUrl()!}
            alt="Background"
            fill
            style={{ objectFit: "cover", zIndex: -1 }}
          />
        </div>
      )}
      <div className="overflow-y-auto w-full">
        {/* Render content using Content component */}
        {content && content.length > 0 && (
          <div>
            {content.map((item, idx) => (
              <Content
                key={idx}
                content={item.content}
                variant={item.variant || "default"}
                title={item.title}
              />
            ))}
          </div>
        )}

        {sections?.map((section: any, idx: number) => (
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
};

export default Group;
