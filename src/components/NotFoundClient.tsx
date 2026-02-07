"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

interface NotFoundClientProps {
  image?: {
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
  } | null;
  headline: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  helpText: string;
  helpfulLinks: Array<{ label: string; url: string }>;
}

export default function NotFoundClient({
  image,
  headline,
  description,
  primaryButtonText,
  primaryButtonUrl,
  secondaryButtonText,
  helpText,
  helpfulLinks,
}: NotFoundClientProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl w-full">
        {/* Content with optional image */}
        <div
          className={`flex flex-col ${image ? "md:flex-row" : ""} gap-8 items-center mb-8`}
        >
          {/* Image on the left */}
          {image && (
            <div className="flex-shrink-0 w-full md:w-1/3">
              <Image
                src={image.url}
                alt={image.alternativeText || "404 error"}
                width={image.width}
                height={image.height}
                className="rounded-2xl w-full h-auto "
              />
            </div>
          )}

          {/* Text content */}
          <div
            className={`${image ? "md:w-2/3 flex flex-col" : "text-center"}`}
          >
            {/* Large 404 */}
            <h1
              className={clsx(
                "text-9xl md:text-[12rem] font-bold text-gray-300 dark:text-gray-700 mb-8 leading-none ",
                image ? "text-left" : "text-center",
              )}
            >
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {headline}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {description}
            </p>

            {/* Actions */}
            <div
              className={`flex flex-col sm:flex-row gap-4 ${image ? "" : "justify-center"}`}
            >
              <Link
                href={primaryButtonUrl}
                className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block text-center"
              >
                {primaryButtonText}
              </Link>
              <button
                onClick={() => window.history.back()}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                {secondaryButtonText}
              </button>
            </div>
            {/* Optional: Common links */}
            {helpfulLinks && helpfulLinks.length > 0 && (
              <div
                className={clsx(
                  "mt-12 pt-8 border-t border-gray-200 dark:border-gray-700",
                  image ? "text-left" : "text-center",
                )}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {helpText}
                </p>
                <div className={clsx("flex flex-wrap gap-4 text-sm", image ? "justify-start" : "justify-center")}>
                  {helpfulLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url}
                      className="text-accent hover:underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
