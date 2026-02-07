import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StrapiCustomCSS from "@/components/StrapiCustomCSS";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Default metadata - will be overridden by page-specific metadata from Strapi
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Clara Grunwald Schule",
    template: "%s | CGS",
  },
  description: "Welcome to Clara Grunwald Schule",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark:[color-scheme:dark]">
      <head>
      <script defer src="https://cloud.umami.is/script.js" data-website-id="1ad5b908-b758-419e-a13f-3965beafa597"></script>
      <StrapiCustomCSS />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
