'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { NavigationCategory, NavigationEntry } from '@/types/navigation';

interface NavigationProps {
  categories: NavigationCategory[];
}

interface NavigationItemProps {
  category: NavigationCategory;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  isMobileMenu: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ category, isOpen, onToggle, onClose, isMobileMenu }) => {
  const sortedEntries = category.navigation_entries?.sort((a, b) => a.order - b.order) || [];
  const [hovered, setHovered] = useState(false);

  // Desktop: show on hover OR click/tap toggle. Mobile menu: only click toggle.
  const showDropdown = isMobileMenu ? isOpen : (hovered || isOpen);

  if (sortedEntries.length === 0) {
    return (
      <div>
        <button
          type="button"
          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 touch-manipulation"
        >
          <span className="font-medium">{category.name}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => { if (!isMobileMenu) setHovered(true); }}
      onMouseLeave={() => { if (!isMobileMenu) { setHovered(false); } }}
    >
      <button
        type="button"
        onClick={onToggle}
        onTouchEnd={(e) => {
          // Prevent the ghost click + mouseenter on touch devices (iPad).
          // This ensures tap toggles the dropdown reliably.
          e.preventDefault();
          onToggle();
        }}
        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 touch-manipulation"
        aria-haspopup="true"
        aria-expanded={showDropdown}
      >
        <span className="font-medium">{category.name}</span>
        <svg
          className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
            showDropdown ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <div className={`${isMobileMenu ? 'relative w-full' : 'absolute top-full left-0 w-64'} bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50 flex flex-col max-h-96 overflow-y-auto`}>
          {sortedEntries.map((entry) => (
            <Link
              key={entry.id}
              href={entry.link}
              className="block px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 touch-manipulation"
              onClick={onClose}
            >
              {entry.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const Navigation: React.FC<NavigationProps> = ({ categories }) => {
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const sortedCategories = categories.sort((a, b) => a.order - b.order);

  const handleToggle = useCallback((categoryId: number) => {
    setOpenCategory(prev => prev === categoryId ? null : categoryId);
  }, []);

  const handleClose = useCallback(() => {
    setOpenCategory(null);
    setMobileMenuOpen(false);
  }, []);

  // Close menu when clicking/tapping outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenCategory(null);
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenCategory(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <nav ref={navRef} className="relative">
      {/* Hamburger button for mobile */}
      <button
        type="button"
        className="sm:hidden flex items-center px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 touch-manipulation"
        onClick={() => setMobileMenuOpen(prev => !prev)}
        aria-label="Toggle menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Desktop horizontal nav */}
      <div className="hidden sm:flex items-center space-x-1">
        {sortedCategories.map((category) => (
          <NavigationItem
            key={category.id}
            category={category}
            isOpen={openCategory === category.id}
            onToggle={() => handleToggle(category.id)}
            onClose={handleClose}
            isMobileMenu={false}
          />
        ))}
      </div>

      {/* Mobile vertical nav */}
      {mobileMenuOpen && (
        <div className="sm:hidden flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg absolute top-full left-0 right-0 z-50 max-h-[80vh] overflow-y-auto">
          {sortedCategories.map((category) => (
            <NavigationItem
              key={category.id}
              category={category}
              isOpen={openCategory === category.id}
              onToggle={() => handleToggle(category.id)}
              onClose={handleClose}
              isMobileMenu={true}
            />
          ))}
        </div>
      )}
    </nav>
  );
};
