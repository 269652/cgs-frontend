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
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title, subtitle, ctaLink, ctaLabel, autocycle }) => (
  <div
    className="relative w-full max-w-full rounded-lg"
    style={{ height: '100%', minHeight: '320px' }}
  >
    {(title || subtitle) && (
      <div
        className="absolute left-8 top-8 z-10 text-white drop-shadow-lg"
        style={{
          left: '2vw',
          top: '2vw',
          width: '90vw',
          maxWidth: '100%',
        }}
      >
        {title && (
          <h2
            className="h1 font-bold mb-2"
            style={{
              fontSize: 'clamp(2rem, 7vw, 3rem)',
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
              fontSize: 'clamp(1rem, 4vw, 1.5rem)',
              maxWidth: '80vw',
              textShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    )}
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={0}
      slidesPerView={1}
      style={{ width: '100%', height: '100%', borderRadius: '8px' }}
      autoplay={autocycle ? { delay: autocycle * 1000, disableOnInteraction: false } : false}
    >
      {images.map((img, idx) => (
        <SwiperSlide
          key={idx}
          className="flex items-center justify-center w-full h-[60vw] min-h-[320px] md:h-[455px]"
          style={{ height: '100%', minHeight: '320px' }}
        >
          <Image
            src={img?.src}
            alt={img?.alt || `Image ${idx + 1}`}
            fill
            style={{ objectFit: 'cover', borderRadius: '8px' }}
            sizes="100vw"
            priority={idx === 0}
          />
        </SwiperSlide>
      ))}
    </Swiper>
    {ctaLink && ctaLabel && (
      <a
        href={ctaLink}
        className="absolute left-8 bottom-8 z-10 bg-accent text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
        style={{ left: '2vw', bottom: '2vw', fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {ctaLabel}
      </a>
    )}
  </div>
);

export default ImageGallery;
