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
  <div style={{ position: 'relative', width: '100%', maxWidth: '100vw', borderRadius: '8px' }}>
    {(title || subtitle) && (
      <div className="absolute left-8 top-8 z-10 text-white drop-shadow-lg">
        {title && <h2 className="h1 text-3xl font-bold mb-2">{title}</h2>}
        {subtitle && <p className="h2 text-lg mb-2 max-w-2/3">{subtitle}</p>}
      </div>
    )}
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={20}
      slidesPerView={1}
      style={{ width: '100%', borderRadius: '8px' }}
      autoplay={autocycle ? { delay: autocycle * 1000, disableOnInteraction: false } : false}
    >
      {images.map((img, idx) => (
        <SwiperSlide key={idx} className="">
          <Image
            src={img.src}
            alt={img.alt || `Image ${idx + 1}`}
            width={1000}
            height={455}
            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
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
        target="_blank"
        rel="noopener noreferrer"
      >
        {ctaLabel}
      </a>
    )}
  </div>
);

export default ImageGallery;
