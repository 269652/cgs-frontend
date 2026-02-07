import React from "react";

export interface FooterProps {
  copyright?: string;
}

const Footer: React.FC<FooterProps> = ({ copyright }) => (
  <footer className="w-full bg-gray-100 bg-background text-gray-600 dark:text-gray-300 py-6 mt-8">
    <div className="max-w-5xl mx-auto flex items-center justify-center px-4">
      {copyright && <span className="text-center">{copyright}</span>}
    </div>
  </footer>
);

export default Footer;
