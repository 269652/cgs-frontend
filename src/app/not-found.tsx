import ErrorDisplay from "@/components/ErrorDisplay";

export default function NotFound() {
  return (
    <ErrorDisplay 
      variant="404"
      title="404 - Page Not Found"
      message="Sorry, the page you are looking for doesn't exist or has been moved."
    />
  );
}