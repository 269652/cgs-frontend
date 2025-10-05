"use client"

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

type ImageGalleryProps = {
  images: { src: string; alt?: string }[];
  title?: string;
  subtitle?: string;
  ctaLink?: string;
  ctaLabel?: string;
  autocycle?: number; // interval in seconds
  variant?: 'fullscreen' | 'inline'; // Add variant prop
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  title, 
  subtitle, 
  ctaLink, 
  ctaLabel, 
  autocycle,
  variant = 'inline' // Default to inline for content usage
}) => {
  const isFullscreen = variant === 'fullscreen';
  return (
    <div
      className={`relative overflow-hidden ${
        isFullscreen 
          ? 'w-full h-screen min-h-screen' 
          : 'w-full h-[300px] md:h-[400px] my-6 rounded-lg'
      }`}
      style={{ 
        maxWidth: isFullscreen ? 'none' : '100%'
      }}
    >
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
            className="relative w-full h-full"
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
    {ctaLink && ctaLabel && (
      <a
        href={ctaLink}
        className={`absolute z-10 bg-accent text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition ${
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
};

export default ImageGallery;
