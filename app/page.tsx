'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import { heroSlides } from '@/lib/data';
import { useLanguage } from '@/lib/language-context';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-content',
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.6, ease: 'power3.out', delay: 0.4 }
      );

      gsap.fromTo('.hero-tagline',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.8 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [currentSlide]);

  useEffect(() => {
    if (!isVideoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVideoPlaying]);

  const handlePlayVideo = () => {
    if (heroSlides[currentSlide].videoUrl && videoRef.current) {
      setIsVideoPlaying(true);
      videoRef.current.play();
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      <section className="relative h-screen flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          {isVideoPlaying && currentHero.videoUrl ? (
            <video
              ref={videoRef}
              src={currentHero.videoUrl}
              className="w-full h-full object-cover"
              onEnded={handleVideoEnd}
              playsInline
              muted
            />
          ) : (
            <Image
              src={currentHero.thumbnail}
              alt={currentHero.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        </div>

        <div className="relative z-10 px-6 lg:px-[100px] pb-12">
          <div className="flex items-end justify-between mb-8">
            <div className="text-[11px] tracking-[0.15em] text-white/40">
              {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
            </div>
            <div className="flex items-center gap-6">
              {currentHero.videoUrl && !isVideoPlaying && (
                <button
                  type="button"
                  onClick={handlePlayVideo}
                  className="text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
                >
                  Play
                </button>
              )}
              <Link
                href="/productions/commercial"
                className="text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
              >
                Discover
              </Link>
            </div>
          </div>

          <div className="hero-content mb-12">
            <h1 className="text-[clamp(3.5rem,15vw,12rem)] font-bold tracking-[-0.04em] leading-[0.85] uppercase mb-4">
              {currentHero.title}
            </h1>
            <div className="flex items-center gap-6 text-[13px] tracking-[0.12em] text-white/60">
              <span>{currentHero.client}</span>
              <span className="w-1 h-1 bg-white/30 rounded-full" />
              <span>{currentHero.year}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className="group"
              >
                <div className={`h-[2px] transition-all duration-500 ${
                  index === currentSlide
                    ? 'w-16 bg-white'
                    : 'w-8 bg-white/20 group-hover:bg-white/40'
                }`} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-[100px] py-32">
        <div className="max-w-6xl">
          <h2 className="hero-tagline text-[clamp(2rem,5vw,4rem)] font-bold tracking-[-0.02em] leading-[1.1] uppercase mb-8">
            Creative production, & post-production studio
          </h2>
          <p className="text-[13px] leading-relaxed text-white/50 uppercase tracking-[0.05em] max-w-3xl">
            Fueled by Feelings
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-[100px] pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {[
            { title: 'Advertisement', href: '/productions/commercial', img: 'https://ext.same-assets.com/3590549328/3551640955.jpeg' },
            { title: 'Originals', href: '/productions/originals', img: 'https://ext.same-assets.com/3590549328/4280035452.jpeg' },
            { title: 'Corporate', href: '/productions/corporate', img: 'https://ext.same-assets.com/3590549328/1668134854.jpeg' },
            { title: 'Music', href: '/productions/music', img: 'https://ext.same-assets.com/3590549328/186996560.jpeg' },
            { title: 'Studio', href: '/productions/studio', img: 'https://ext.same-assets.com/3590549328/3551640955.jpeg' },
            { title: 'About', href: '/about', img: 'https://ext.same-assets.com/3590549328/1610790658.jpeg' },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative aspect-[4/5] bg-black overflow-hidden"
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-end p-8">
                <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-[-0.02em] uppercase">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
