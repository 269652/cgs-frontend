"use client"

import React, { useEffect } from 'react';
import Image from 'next/image';

type LightboxProps = {
  images: { src: string; alt?: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;
  const currentImage = images[currentIndex];

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (!isFirst) onPrev();
          break;
        case 'ArrowRight':
          if (!isLast) onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFirst, isLast, onClose, onNext, onPrev]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/10"
        aria-label="Close lightbox"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>

      {/* Previous button */}
      {!isFirst && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white/80 hover:text-white transition-all duration-200 p-3 rounded-full hover:bg-white/10 disabled:opacity-50"
          aria-label="Previous image"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
      )}

      {/* Next button */}
      {!isLast && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white/80 hover:text-white transition-all duration-200 p-3 rounded-full hover:bg-white/10 disabled:opacity-50"
          aria-label="Next image"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      )}

      {/* Image container */}
      <div 
        className="relative flex items-center justify-center w-full h-full px-4 py-4 md:px-8 md:py-8"
        onClick={onClose}
      >
        <Image
          src={currentImage.src}
          alt={currentImage.alt || `Image ${currentIndex + 1}`}
          width={1200}
          height={800}
          className="max-w-full object-contain max-h-[80vh] md:max-h-[100vh] md:max-w-[100vw]"
          style={{ 
            width: '80vw', 
            height: '80svh'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
        />
      </div>

      {/* Image counter */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/90 text-sm bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
        <span className="font-medium">{currentIndex + 1}</span>
        <span className="text-white/60 mx-1">/</span>
        <span className="text-white/80">{images.length}</span>
      </div>
    </div>
  );
};

export default Lightbox;