'use client';

import type { Metadata } from "next";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl w-full text-center">
        {/* Large 404 */}
        <h1 className="text-9xl md:text-[12rem] font-bold text-gray-300 dark:text-gray-700 mb-4 leading-none">
          404
        </h1>
        
        {/* Error message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Seite nicht gefunden
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Zur Startseite
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Zurück
          </button>
        </div>

        {/* Optional: Common links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Vielleicht finden Sie hier was Sie suchen:
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/" className="text-accent hover:underline">
              Startseite
            </Link>
            <Link href="/ansprechpartner" className="text-accent hover:underline">
              Kontakt
            </Link>
            <Link href="/impressum" className="text-accent hover:underline">
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}