import React from "react";
import ImageGallery from "./ImageGallery";
import Teaser from "./Teaser";
import TripleTease from "./TripleTease";
import Container from "./Container";
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

/**
 * Section component that can render either:
 * 1. Dynamic zone content (components like image galleries, teasers, etc.)
 * 2. Content relation (references to Content entries with markdown)
 * 3. Both types together
 */
export const Section: React.FC<SectionProps> = ({
  background,
  content = [],
  contentRelation = [],
  bgImage,
  isInline = false,
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center relative ${
        isInline 
          ? 'p-1 md:p-2 !px-8' // Minimal padding for inline usage
          : 'min-h-screen p-2 md:p-8' // Full height and padding for standalone sections
      } ${!background && !bgImage ? ' dark:bg-gray-800' : ''}`}
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
      {content.map((cmp, idx) => {
        // Handle Container first (it's not in componentMap, renders children)
        if (cmp.__component === "container.container") {
          const children = Array.isArray(cmp.children) ? cmp.children : [];
          return (
            <Container key={idx}>
              {children.map((child: any, childIdx: number) => {
                const ChildCmp = componentMap[child.__component];
                if (!ChildCmp) return null;
                if (child.__component === "image-gallery.image-gallery") {
                  let images: { src: string; alt?: string }[] = [];
                  if (Array.isArray(child.images)) {
                    child.images.forEach((img: any) => {
                      if (img?.url) {
                        images.push({
                          src: imageLink(img.url),
                          alt: img?.alternativeText || img?.name || 'Gallery image',
                        });
                      } else if (img?.file) {
                        images.push({
                          src: imageLink(img.file.url),
                          alt: img?.alt || img.file.name,
                        });
                      }
                    });
                  }
                  return <ChildCmp key={childIdx} {...child} images={images} variant={child.variant || "slider"} displayVariant="inline" />;
                }
                if (child.__component === "teaser.teaser") {
                  // Handle multiple images (new) or single image (legacy)
                  let teaserImages: { src: string; alt?: string }[] | undefined;
                  if (Array.isArray(child.images) && child.images.length > 0) {
                    teaserImages = child.images.map((img: any) => ({
                      src: imageLink(img.url),
                      alt: img.alternativeText || img.name || child.title,
                    }));
                  }
                  const teaserProps = {
                    variant: child.variant,
                    title: child.title,
                    copy: child.copy,
                    ctaLink: child.ctaLink,
                    ctaLabel: child.ctaLabel,
                    className: child.className,
                    images: teaserImages,
                    // Legacy single image fallback
                    image:
                      child.image && child.image.url
                        ? {
                            src: imageLink(child.image.url),
                            alt: child.image.name || child.title,
                          }
                        : undefined,
                  };
                  return <ChildCmp key={childIdx} {...teaserProps} />;
                }
                if (child.__component === "triple-tease.triple-tease") {
                  const teasers = Array.isArray(child.teasers)
                    ? child.teasers.map((teaser: any) => {
                        let teaserImages: { src: string; alt?: string }[] | undefined;
                        if (Array.isArray(teaser.images) && teaser.images.length > 0) {
                          teaserImages = teaser.images.map((img: any) => ({
                            src: imageLink(img.url),
                            alt: img.alternativeText || img.name || teaser.title,
                          }));
                        }
                        return {
                          variant: teaser.variant,
                          title: teaser.title,
                          copy: teaser.copy,
                          ctaLink: teaser.ctaLink,
                          ctaLabel: teaser.ctaLabel,
                          images: teaserImages,
                          image:
                            teaser.image && teaser.image.url
                              ? {
                                  src: imageLink(teaser.image.url),
                                  alt: teaser.image.name || teaser.title,
                                }
                              : undefined,
                        };
                      })
                    : [];
                  return <ChildCmp key={childIdx} title={child.title} teasers={teasers} />;
                }
                return <ChildCmp key={childIdx} {...child} />;
              })}
            </Container>
          );
        }

        const Cmp = componentMap[cmp.__component];
        if (!Cmp) return null;
        if (cmp.__component === "image-gallery.image-gallery") {
          let images: { src: string; alt?: string }[] = [];
          // Handle new simplified media structure
          if (Array.isArray(cmp.images)) {
            cmp.images.forEach((img: any) => {
              // Direct media files (new structure)
              if (img?.url) {
                images.push({
                  src: imageLink(img.url),
                  alt: img?.alternativeText || img?.name || 'Gallery image',
                });
              }
              // Legacy structure with file property (for backward compatibility)
              else if (img?.file) {
                images.push({
                  src: imageLink(img.file.url),
                  alt: img?.alt || img.file.name,
                });
              }
            });
          }
          // Use fullscreen for the first image gallery in non-inline sections
          const isFirstImageGallery = idx === 0;
          const displayVariant = (isInline || !isFirstImageGallery) ? "inline" : "fullscreen";
          return <Cmp 
            key={idx} 
            {...cmp} 
            images={images} 
            autocycle={7} 
            variant={cmp.variant || "slider"} // Use Strapi variant (slider/grid)
            displayVariant={displayVariant} // Keep existing fullscreen/inline logic
          />;
        }
        if (cmp.__component === "teaser.teaser") {
          // Handle multiple images (new) or single image (legacy)
          let teaserImages: { src: string; alt?: string }[] | undefined;
          if (Array.isArray(cmp.images) && cmp.images.length > 0) {
            teaserImages = cmp.images.map((img: any) => ({
              src: imageLink(img.url),
              alt: img.alternativeText || img.name || cmp.title,
            }));
          }
          // Map Strapi teaser fields to Teaser props
          const teaserProps = {
            variant: cmp.variant,
            title: cmp.title,
            copy: cmp.copy,
            ctaLink: cmp.ctaLink,
            ctaLabel: cmp.ctaLabel,
            className: cmp.className,
            images: teaserImages,
            // Legacy single image fallback
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
            ? cmp.teasers.map((teaser: any) => {
                let teaserImages: { src: string; alt?: string }[] | undefined;
                if (Array.isArray(teaser.images) && teaser.images.length > 0) {
                  teaserImages = teaser.images.map((img: any) => ({
                    src: imageLink(img.url),
                    alt: img.alternativeText || img.name || teaser.title,
                  }));
                }
                return {
                  variant: teaser.variant,
                  title: teaser.title,
                  copy: teaser.copy,
                  ctaLink: teaser.ctaLink,
                  ctaLabel: teaser.ctaLabel,
                  images: teaserImages,
                  image:
                    teaser.image && teaser.image.url
                      ? {
                          src: imageLink(teaser.image.url),
                          alt: teaser.image.name || teaser.title,
                        }
                      : undefined,
                };
              })
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

  // If there's content, sections should be treated as inline (part of content flow)
  const hasContent = content && content.length > 0;
  const sectionsAreInline = hasContent;

  return (
    <div className={`w-full  dark:bg-gray-800 ${backgroundImage ? 'relative' : ''}`}>
      {backgroundImage && (
        <div className="fixed inset-0 z-0">
          <Image
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
            isInline={section.inline !== undefined ? section.inline : sectionsAreInline} // Use backend inline checkbox or fallback to auto-detection
          />
        ))}
      </div>
    </div>
  );
};

export default Group;
