import React from "react";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  error?: string;
  retryUrl?: string;
  retryLabel?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Service Unavailable",
  message = "Unable to connect to the content management system. Please try again later.",
  error,
  retryUrl = "/",
  retryLabel = "Retry"
}) => {
  return (
    <div className="font-sans items-center justify-items-center min-h-screen">
      <main className="flex flex-col items-center justify-center w-full min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-800 mb-4">{title}</h1>
          <p className="text-red-700 mb-4">{message}</p>
          {error && (
            <p className="text-sm text-red-600 mb-4">
              Error: {error}
            </p>
          )}
          <div className="mt-4">
            <a 
              href={retryUrl}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors inline-block"
            >
              {retryLabel}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ErrorDisplay;