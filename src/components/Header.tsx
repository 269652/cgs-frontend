import React from "react";
import { imageLink } from "@/lib/imageLink";
import { Navigation } from "./Navigation";
import { NavigationCategory } from "@/types/navigation";
import Impressum from "./Impressum";
import Link from "next/link";
import { StrapiImageClient } from "./StrapiImage";

export interface HeaderProps {
  logo?: {
    url: string;
    name?: string;
    blurDataURL?: string;
    isSvg?: boolean;
  };
  impressum?: {
    content: string;
  };
  images?: Array<{
    url: string;
    name?: string;
    blurDataURL?: string;
    isSvg?: boolean;
  }>;
  navigation?: NavigationCategory[];
}

const Header: React.FC<HeaderProps> = ({ logo, impressum, images, navigation }) => (
  <header className="w-full dark:bg-gray-800">
    {/* Top bar with logo and contact info */}
    <div className="shadow dark:shadow-gray-800 flex flex-col sm:flex-row gap-6 items-center justify-between px-8 py-6">
      <div className="flex flex-col sm:flex-row items-center">

        {logo && (
        <Link href="/" className="block h-[80px]" style={{ width: '200px' }}>
          <StrapiImageClient
            src={imageLink(logo.url)}
            alt=""
            width={200}
            height={80}
            className="h-[80px] w-auto"
            style={{ objectFit: "contain" }}
            blurDataURL={logo.blurDataURL}
            isSvg={logo.isSvg}
            priority
          />
        </Link>

        )}
      </div>
      {impressum && (
        <Impressum text={impressum.content} />
      )}
    </div>

    {/* Image gallery row */}
    {images && images.length > 0 && (
      <div className="flex flex-col md:flex-row w-full gap-0 max-w-[calc(100vw-0rem)]" >
        {images.map((image, idx) => (
          <div key={idx} className="flex-1 relative overflow-hidden first:hidden md:first:block">
            <StrapiImageClient
              src={imageLink(image.url)}
              alt=""
              width={400}
              height={210}
              className="w-full h-[300px] md:h-[210px] object-cover"
              style={{ objectFit: "cover", objectPosition: "center" }}
              blurDataURL={image.blurDataURL}
              isSvg={image.isSvg}
              priority={idx === 0}
            />
            {/* No-JS fallback */}
            <noscript>
              <img
                src={imageLink(image.url)}
                alt={image.name || `Header image ${idx + 1}`}
                className="w-full h-[300px] md:h-[210px] object-cover"
                style={{ objectFit: "cover", objectPosition: "center" }}
                loading="lazy"
              />
            </noscript>
          </div>
        ))}
      </div>
    )}
        {/* Navigation menu */}
    {navigation && navigation.length > 0 && (
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4">
        <Navigation categories={navigation} />
      </div>
    )}
  </header>
);

export default Header;
