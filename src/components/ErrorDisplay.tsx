import React from "react";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  error?: string;
  retryUrl?: string;
  retryLabel?: string;
  variant?: 'error' | '404';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Service Unavailable",
  message = "Unable to connect to the content management system. Please try again later.",
  error,
  retryUrl = "/",
  retryLabel = "Retry",
  variant = 'error'
}) => {
  // Different styling and content based on variant
  const is404 = variant === '404';
  
  const containerClass = is404 
    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" 
    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800";
    
  const iconColor = is404 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400";
  const titleColor = is404 ? "text-blue-800 dark:text-blue-200" : "text-red-800 dark:text-red-200";
  const messageColor = is404 ? "text-blue-700 dark:text-blue-300" : "text-red-700 dark:text-red-300";
  const errorColor = is404 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400";
  const buttonClass = is404 
    ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" 
    : "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600";
    
  const icon = is404 ? "🔍" : "⚠️";
  const defaultTitle = is404 ? "Page Not Found" : "Service Unavailable";
  const defaultMessage = is404 
    ? "The page you're looking for doesn't exist or has been moved."
    : "Unable to connect to the content management system. Please try again later.";
  const defaultRetryLabel = is404 ? "Go Home" : "Retry";

  return (
    <div className="font-sans flex items-center justify-center min-h-screen px-4 py-8 bg-white dark:bg-gray-900">
      <main className="w-full max-w-lg">
        <div className={`${containerClass} rounded-lg p-4 sm:p-6 md:p-8 text-center shadow-lg`}>
          <div className={`${iconColor} text-4xl sm:text-5xl md:text-6xl mb-4`}>{icon}</div>
          <h2 className={`!text-md md:text-2xl font-bold ${titleColor} mb-4 leading-tight`}>
            {title || defaultTitle}
          </h2>
          <p className={`text-sm sm:text-base ${messageColor} mb-4 leading-relaxed`}>
            {message || defaultMessage}
          </p>
          {error && (
            <p className={`text-xs sm:text-sm ${errorColor} mb-4 break-words`}>
              Error: {error}
            </p>
          )}
          <div className="mt-4">
            <a 
              href={retryUrl}
              className={`${buttonClass} text-white px-4 py-2 sm:px-6 sm:py-3 rounded transition-colors inline-block text-sm sm:text-base font-medium touch-manipulation`}
            >
              {retryLabel || defaultRetryLabel}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ErrorDisplay;