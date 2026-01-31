"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Lightbox from './Lightbox';

type ImageGalleryProps = {
  images: { src: string; alt?: string }[];
  title?: string;
  subtitle?: string;
  ctaLink?: string;
  ctaLabel?: string;
  autocycle?: number; // interval in seconds
  variant?: 'slider' | 'grid';
  displayVariant?: 'fullscreen' | 'inline'; // For backward compatibility
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  title, 
  subtitle, 
  ctaLink, 
  ctaLabel, 
  autocycle,
  variant = 'slider',
  displayVariant = 'fullscreen' // Default to inline for content usage
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isFullscreen = displayVariant === 'fullscreen';

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Grid variant component - Modern masonry-style layout
  const GridGallery = () => (
    <div className={`relative ${isFullscreen ? 'min-h-screen p-8' : 'my-6 px-4'}`}>
      {/* Title and subtitle overlay for grid */}
      {(title || subtitle) && (
        <div className={`mb-8 ${isFullscreen ? 'text-center' : ''}`}>
          {title && (
            <h2
              className={`font-bold mb-3 ${isFullscreen ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}
              style={{
                fontSize: isFullscreen ? 'clamp(2rem, 7vw, 3rem)' : 'clamp(1.5rem, 5vw, 2.5rem)',
                lineHeight: '1.1',
                textShadow: isFullscreen ? '0 2px 8px rgba(0,0,0,0.25)' : 'none',
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={`mb-6 ${isFullscreen ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}
              style={{
                fontSize: isFullscreen ? 'clamp(1rem, 4vw, 1.5rem)' : 'clamp(1rem, 3vw, 1.25rem)',
                textShadow: isFullscreen ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Modern masonry-style grid layout */}
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4 space-y-3 md:space-y-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative break-inside-avoid mb-3 md:mb-4 overflow-hidden rounded-xl cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => openLightbox(idx)}
          >
            <Image
              src={img.src}
              alt={img.alt || `Image ${idx + 1}`}
              width={400}
              height={300}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              style={{ 
                objectFit: 'cover',
                aspectRatio: '1/1'
              }}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, (max-width: 1600px) 25vw, 20vw"
            />
            
            {/* Modern hover overlay with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
              <div className="text-white text-center">
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">View</span>
              </div>
            </div>

            {/* Subtle border for definition */}
            <div className="absolute inset-0 rounded-xl ring-1 ring-black/10 dark:ring-white/10 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* CTA button for grid */}
      {ctaLink && ctaLabel && (
        <div className={`mt-8 ${isFullscreen ? 'text-center' : ''}`}>
          <a
            href={ctaLink}
            className={`inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium ${
              isFullscreen ? 'text-lg' : ''
            }`}
            rel="noopener noreferrer"
          >
            {ctaLabel}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </a>
        </div>
      )}
    </div>
  );

  // Slider variant component (existing implementation)
  const SliderGallery = () => (
    <div
      className={`relative overflow-hidden ${
        isFullscreen 
          ? 'w-full h-[calc(100vh-4rem)] min-h-[calc(100svh-1rem)] md:min-h-[calc(100vh-4rem)] rounded-lg' 
          : 'w-full h-[300px] md:h-[400px] my-6 rounded-lg'
      }`}
      style={{ 
        maxWidth: isFullscreen ? 'none' : '100%'
      }}
    >
      {/* Title and subtitle overlay for slider */}
      {(title || subtitle) && (
        <div
          className={`absolute z-10 text-white drop-shadow-lg ${
            isFullscreen ? 'left-8 top-8' : 'left-4 top-4'
          }`}
          style={{
            left: isFullscreen ? '2vw' : '1rem',
            top: isFullscreen ? '2vw' : '1rem',
            width: isFullscreen ? '90vw' : 'calc(100% - 2rem)',
            maxWidth: '100%',
          }}
        >
          {title && (
            <h2
              className="h1 font-bold mb-2"
              style={{
                fontSize: isFullscreen ? 'clamp(2rem, 7vw, 3rem)' : 'clamp(1.25rem, 4vw, 2rem)',
                lineHeight: '1.1',
                textShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className="h2 mb-2"
              style={{
                fontSize: isFullscreen ? 'clamp(1rem, 4vw, 1.5rem)' : 'clamp(0.875rem, 3vw, 1.125rem)',
                maxWidth: isFullscreen ? '80vw' : '90%',
                textShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div 
        className="w-fit h-full max-w-full"
        style={{ 
          width: '100%', 
          height: '100%'
        }}
      >
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
          style={{ 
            width: '100%', 
            height: '100%'
          }}
          autoplay={autocycle ? { delay: autocycle * 1000, disableOnInteraction: false } : false}
        >
          {images.map((img, idx) => (
            <SwiperSlide
              key={idx}
              className="relative w-full h-full cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <Image
                src={img?.src}
                alt={img?.alt || `Image ${idx + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes={isFullscreen ? "100vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"}
                priority={idx === 0}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* CTA button for slider */}
      {ctaLink && ctaLabel && (
        <a
          href={ctaLink}
          className={`absolute z-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-2 rounded-lg shadow-lg transition ${
            isFullscreen ? 'left-8 bottom-8' : 'left-4 bottom-4'
          }`}
          style={{ 
            left: isFullscreen ? '2vw' : '1rem', 
            bottom: isFullscreen ? '2vw' : '1rem', 
            fontSize: isFullscreen ? 'clamp(1rem, 4vw, 1.25rem)' : '1rem'
          }}
          rel="noopener noreferrer"
        >
          {ctaLabel}
        </a>
      )}
    </div>
  );

  return (
    <>
      {variant === 'grid' ? <GridGallery /> : <SliderGallery />}
      
      {/* Lightbox */}
      <Lightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </>
  );
};

export default ImageGallery;
