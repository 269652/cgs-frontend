'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NavigationCategory, NavigationEntry } from '@/types/navigation';

interface NavigationProps {
  categories: NavigationCategory[];
}

interface NavigationItemProps {
  category: NavigationCategory;
  isOpen: boolean;
  onToggle: () => void;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ category, isOpen, onToggle }) => {
  const sortedEntries = category.navigation_entries?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200 touch-manipulation"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{category.name}</span>
        {sortedEntries.length > 0 && (
          <svg
            className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      
      {/* Desktop hover menu */}
      <div className="hidden md:group-hover:flex absolute top-full left-0 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-50 flex-col">
        {sortedEntries.map((entry) => (
          <Link
            key={entry.id}
            href={entry.link}
            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
          >
            {entry.label}
          </Link>
        ))}
      </div>
      
      {/* Mobile/tablet click menu */}
      <div className={`${
        isOpen ? 'flex' : 'hidden'
      } md:hidden absolute top-full left-0 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-50 flex-col max-h-96 overflow-y-auto`}>
        {sortedEntries.map((entry) => (
          <Link
            key={entry.id}
            href={entry.link}
            className="block px-4 py-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 touch-manipulation"
            onClick={onToggle} // Close menu when item is clicked
          >
            {entry.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Navigation: React.FC<NavigationProps> = ({ categories }) => {
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const sortedCategories = categories.sort((a, b) => a.order - b.order);

  const handleToggle = (categoryId: number) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-navigation-item]')) {
        setOpenCategory(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenCategory(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <nav className="flex items-center space-x-1 relative">
      {sortedCategories.map((category) => (
        <div key={category.id} data-navigation-item>
          <NavigationItem
            category={category}
            isOpen={openCategory === category.id}
            onToggle={() => handleToggle(category.id)}
          />
        </div>
      ))}
    </nav>
  );
};