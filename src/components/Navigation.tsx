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
        className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
        aria-haspopup="true"
      >
        <span className="font-medium">{category.name}</span>
        {sortedEntries.length > 0 && (
          <svg
            className="ml-2 h-4 w-4 transform transition-transform duration-200 group-hover:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
  <div className="hidden group-hover:flex absolute top-full left-0 w-64 bg-white shadow-lg rounded-md border border-gray-200 z-50  flex-col">
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
    </div>
  );
};

export const  Navigation: React.FC<NavigationProps> = ({ categories }) => {
  const sortedCategories = categories.sort((a, b) => a.order - b.order);

  return (
    <nav className="flex items-center space-x-1">
      {sortedCategories.map((category) => (
        <NavigationItem
          key={category.id}
          category={category}
          isOpen={false}
          onToggle={() => {}}
        />
      ))}
    </nav>
  );
};