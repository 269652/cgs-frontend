import React from "react";
import ImageGallery from "./ImageGallery";
import Teaser from "./Teaser";
import TripleTease from "./TripleTease";
import Container from "./Container";
import Content from "./Content";
import { imageLink } from "@/lib/imageLink";
import Header from "./Header";
import { NavigationCategory } from "@/types/navigation";
import StrapiImage from "./StrapiImage";
import { getBlurDataURL } from "@/lib/blur";

const componentMap: Record<string, React.FC<any>> = {
  "image-gallery.image-gallery": ImageGallery,
  "teaser.teaser": Teaser,
  "triple-tease.triple-tease": TripleTease,
};

type SectionProps = {
  background?: string;
  content: any[];
  contentRelation?: Array<{
    content: string;
    variant?: "default" | "dark";
    title?: string;
  }>;
  bgImage?: any;
  isInline?: boolean;
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
    contentRelation?: Array<{
      content: string;
      variant?: "default" | "dark";
      title?: string;
    }>;
    inline?: boolean;
  }>;
  header?: any;
  navigation?: NavigationCategory[];
};

/** Enrich an image with a blur placeholder data URL */
async function withBlur(src: string, alt?: string) {
  const blurDataURL = await getBlurDataURL(src);
  return { src, alt, blurDataURL };
}

/** Resolve a raw Strapi image array into images with blur data */
async function resolveImages(rawImages: any[]): Promise<{ src: string; alt?: string; blurDataURL?: string }[]> {
  const mapped: { src: string; alt?: string }[] = [];
  for (const img of rawImages) {
    if (img?.url) {
      mapped.push({ src: imageLink(img.url), alt: img?.alternativeText || img?.name || "Gallery image" });
    } else if (img?.file) {
      mapped.push({ src: imageLink(img.file.url), alt: img?.alt || img.file.name });
    }
  }
  return Promise.all(mapped.map((img) => withBlur(img.src, img.alt)));
}

/** Resolve teaser images (multiple or single legacy) with blur data */
async function resolveTeaserImages(cmp: any) {
  let images: { src: string; alt?: string; blurDataURL?: string }[] | undefined;
  if (Array.isArray(cmp.images) && cmp.images.length > 0) {
    images = await Promise.all(
      cmp.images.map(async (img: any) =>
        withBlur(imageLink(img.url), img.alternativeText || img.name || cmp.title)
      )
    );
  }
  let image: { src: string; alt?: string; blurDataURL?: string } | undefined;
  if (cmp.image?.url) {
    image = await withBlur(imageLink(cmp.image.url), cmp.image.name || cmp.title);
  }
  return { images, image };
}

/**
 * Section component that can render either:
 * 1. Dynamic zone content (components like image galleries, teasers, etc.)
 * 2. Content relation (references to Content entries with markdown)
 * 3. Both types together
 */
export const Section: React.FC<SectionProps> = async ({
  background,
  content = [],
  contentRelation = [],
  bgImage,
  isInline = false,
}) => {
  /** Render a single dynamic-zone component with pre-computed blur data */
  async function renderComponent(cmp: any, idx: number, insideContainer = false) {
    const Cmp = componentMap[cmp.__component];
    if (!Cmp) return null;

    if (cmp.__component === "image-gallery.image-gallery") {
      const images = Array.isArray(cmp.images) ? await resolveImages(cmp.images) : [];
      const displayVariant = insideContainer ? "inline" : (isInline || idx !== 0) ? "inline" : "fullscreen";
      return (
        <Cmp
          key={idx}
          {...cmp}
          images={images}
          autocycle={insideContainer ? undefined : 7}
          variant={cmp.variant || "slider"}
          displayVariant={displayVariant}
        />
      );
    }

    if (cmp.__component === "teaser.teaser") {
      const { images, image } = await resolveTeaserImages(cmp);
      return (
        <Cmp
          key={idx}
          variant={cmp.variant}
          title={cmp.title}
          copy={cmp.copy}
          ctaLink={cmp.ctaLink}
          ctaLabel={cmp.ctaLabel}
          className={cmp.className}
          images={images}
          image={image}
        />
      );
    }

    if (cmp.__component === "triple-tease.triple-tease") {
      const teasers = Array.isArray(cmp.teasers)
        ? await Promise.all(
            cmp.teasers.map(async (teaser: any) => {
              const { images, image } = await resolveTeaserImages(teaser);
              return {
                variant: teaser.variant,
                title: teaser.title,
                copy: teaser.copy,
                ctaLink: teaser.ctaLink,
                ctaLabel: teaser.ctaLabel,
                images,
                image,
              };
            })
          )
        : [];
      return <Cmp key={idx} title={cmp.title} teasers={teasers} />;
    }

    return <Cmp key={idx} {...cmp} />;
  }

  /** Render all content items, handling containers */
  const renderedContent = await Promise.all(
    content.map(async (cmp, idx) => {
      if (cmp.__component === "container.container") {
        const children = Array.isArray(cmp.children) ? cmp.children : [];
        const renderedChildren = await Promise.all(
          children.map((child: any, childIdx: number) => renderComponent(child, childIdx, true))
        );
        return <Container key={idx}>{renderedChildren}</Container>;
      }
      return renderComponent(cmp, idx);
    })
  );

  return (
    <div
      className={`flex flex-col justify-center items-center relative ${
        isInline
          ? "p-1 md:p-2 !px-8"
          : "min-h-screen p-2 md:p-8"
      } ${!background && !bgImage ? " bg-background" : ""}`}
      style={{
        backgroundColor: background || undefined,
        backgroundImage: bgImage ? `url(${imageLink(bgImage.url)})` : undefined,
        backgroundSize: bgImage ? "cover" : undefined,
      }}
    >
      {/* Render content relation items (Content entries) */}
      {contentRelation && contentRelation.length > 0 && (
        <div className="w-full">
          {contentRelation.map((item, idx) => (
            <Content
              key={`content-${idx}`}
              content={item.content}
              variant={item.variant || "default"}
              title={item.title}
            />
          ))}
        </div>
      )}

      {/* Render dynamic zone content (components) */}
      {renderedContent}
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

  // If there's content, sections should be treated as inline (part of content flow)
  const hasContent = content && content.length > 0;
  const sectionsAreInline = hasContent;

  return (
    <div className={`w-full  bg-background ${backgroundImage ? "relative" : ""}`}>
      {backgroundImage && (
        <div className="fixed inset-0 z-0">
          <StrapiImage
            src={getBackgroundImageUrl()!}
            alt="Background"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <div className="relative z-10 w-full">
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
            background={section.bgColor || section.background}
            content={section.content || []}
            contentRelation={section.contentRelation || []}
            bgImage={section.bgImage}
            isInline={section.inline !== undefined ? section.inline : sectionsAreInline}
          />
        ))}
      </div>
    </div>
  );
};

export default Group;
