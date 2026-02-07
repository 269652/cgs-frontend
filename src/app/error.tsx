'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl w-full text-center">
        {/* Large 500 */}
        <h1 className="text-9xl md:text-[12rem] font-bold text-red-200 dark:text-red-900/50 mb-4 leading-none">
          500
        </h1>
        
        {/* Error message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ein Fehler ist aufgetreten
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Entschuldigung, beim Laden der Seite ist ein Fehler aufgetreten.
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">
              Fehler-ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Erneut versuchen
          </button>
          <Link
            href="/"
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            Zur Startseite
          </Link>
        </div>

        {/* Help text */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Falls das Problem weiterhin besteht, kontaktieren Sie uns bitte über{' '}
            <Link href="/ansprechpartner" className="text-accent hover:underline">
              unsere Kontaktseite
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
