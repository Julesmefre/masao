'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Production } from '@/lib/data';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CinematicCardProps {
  production: Production;
  index: number;
  variant?: 'full' | 'half-left' | 'half-right';
  aspectRatio?: 'video' | 'square' | 'portrait';
}

export default function CinematicCard({
  production,
  index,
  variant = 'full',
  aspectRatio = 'video',
}: CinematicCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Scroll reveal and parallax
  useEffect(() => {
    const container = containerRef.current;
    const imageContainer = imageContainerRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const meta = metaRef.current;

    if (!container || !imageContainer || !image) return;

    // Initial state - clip path reveal
    gsap.set(imageContainer, {
      clipPath: 'inset(100% 0% 0% 0%)',
    });
    gsap.set(image, {
      scale: 1.2,
    });
    if (title) gsap.set(title, { opacity: 0, y: 20 });
    if (meta) gsap.set(meta, { opacity: 0, y: 15 });

    // Create reveal timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        end: 'top 30%',
        toggleActions: 'play none none none',
      },
    });

    // Image reveal
    tl.to(imageContainer, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.2,
      ease: 'power3.inOut',
    })
    .to(image, {
      scale: 1,
      duration: 1.4,
      ease: 'power3.out',
    }, '<')
    // Staggered text reveal
    .to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.8')
    .to(meta, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.6');

    // Parallax effect - image moves at 60% scroll speed
    gsap.to(image, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Hover animation - organic zoom
  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    if (isHovered) {
      gsap.to(image, {
        scale: 1.03,
        duration: 1.5,
        ease: 'expo.out',
      });
    } else {
      gsap.to(image, {
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
      });
    }
  }, [isHovered]);

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
  };

  const variantClasses = {
    full: 'w-full',
    'half-left': 'w-full lg:w-[45%]',
    'half-right': 'w-full lg:w-[55%] lg:ml-auto',
  };

  const offsetStyles = {
    full: {},
    'half-left': { marginTop: index % 2 === 0 ? '0' : '10vh' },
    'half-right': { marginTop: index % 2 === 0 ? '5vh' : '0' },
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${variantClasses[variant]}`}
      style={offsetStyles[variant]}
    >
      <Link
        href={`/production/${production.slug}?category=${production.category}`}
        className="block group view-trigger"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Clip Path */}
        <div
          ref={imageContainerRef}
          className={`relative ${aspectClasses[aspectRatio]} overflow-hidden`}
        >
          {/* Parallax Image Wrapper */}
          <div
            ref={imageRef}
            className="absolute inset-[-20%] w-[140%] h-[140%]"
          >
            <Image
              src={production.thumbnail}
              alt={production.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Play indicator on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-16 h-16 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-sm bg-white/5">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="white" className="ml-1">
                <polygon points="0,0 18,10 0,20" />
              </svg>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-6">
          <div ref={titleRef} className="mb-2">
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase">
              {production.title}
            </h3>
          </div>
          <div ref={metaRef} className="flex items-center gap-4 text-white/50">
            <span className="text-[11px] tracking-[0.15em] uppercase font-light">
              {production.client}
            </span>
            {production.director && (
              <>
                <span className="w-1 h-1 bg-white/30 rounded-full" />
                <span className="text-[11px] tracking-[0.15em] uppercase font-light">
                  {production.director}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
