'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { heroSlides, commercialProductions, originalsProductions } from '@/lib/data';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 2.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.6,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenisRef.current.on('scroll', ScrollTrigger.update);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  // Hero animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in hero content
      gsap.fromTo('.hero-content',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.5 }
      );

      // Animate sections on scroll
      gsap.utils.toArray<HTMLElement>('.fade-in-section').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Auto-advance slides
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
  const featuredCommercial = commercialProductions.slice(0, 3);
  const featuredOriginals = originalsProductions.slice(0, 2);

  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-end">
        {/* Background Image/Video */}
        <div className="absolute inset-0">
          {isVideoPlaying && currentHero.videoUrl ? (
            <video
              ref={videoRef}
              src={currentHero.videoUrl}
              className="w-full h-full object-cover"
              onEnded={handleVideoEnd}
              playsInline
            />
          ) : (
            <Image
              src={currentHero.thumbnail}
              alt={currentHero.title}
              fill
              className="object-cover transition-opacity duration-1000"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 lg:px-[100px] pb-16 hero-content">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Title */}
            <div>
              <h1 className="text-[clamp(3rem,12vw,8rem)] font-bold tracking-[-0.03em] leading-[0.95] uppercase mb-4">
                {currentHero.title}
              </h1>
              <div className="flex items-center gap-8 text-[11px] tracking-[0.15em] text-white/60">
                <span>{currentHero.client}</span>
                <span>{currentHero.year}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8">
              {currentHero.videoUrl && !isVideoPlaying && (
                <button
                  type="button"
                  onClick={handlePlayVideo}
                  className="text-[11px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-opacity"
                >
                  Play
                </button>
              )}
              <div className="flex items-center gap-4">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`w-8 h-px transition-all duration-300 ${
                      index === currentSlide ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-6 lg:left-[100px] text-[11px] tracking-[0.15em] text-white/30">
          Scroll
        </div>
      </section>

      {/* Featured Commercial Work */}
      <section className="px-6 lg:px-[100px] py-24">
        <div className="fade-in-section mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[clamp(2rem,6vw,4rem)] font-bold tracking-[-0.02em] uppercase">
              Featured Work
            </h2>
            <Link
              href="/productions/commercial"
              className="text-[11px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredCommercial.map((production, index) => (
            <Link
              key={production.id}
              href={`/productions/commercial/${production.slug}`}
              className="fade-in-section group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-4">
                <Image
                  src={production.thumbnail}
                  alt={production.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
              </div>
              <h3 className="text-[16px] font-bold tracking-[-0.01em] uppercase mb-2 group-hover:opacity-60 transition-opacity">
                {production.title}
              </h3>
              <div className="flex items-center gap-4 text-[11px] tracking-[0.1em] text-white/50">
                <span>{production.client}</span>
                {production.director && <span>{production.director}</span>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Originals Section */}
      <section className="px-6 lg:px-[100px] py-24 border-t border-white/10">
        <div className="fade-in-section mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[clamp(2rem,6vw,4rem)] font-bold tracking-[-0.02em] uppercase">
              Original Productions
            </h2>
            <Link
              href="/productions/originals"
              className="text-[11px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {featuredOriginals.map((production, index) => (
            <Link
              key={production.id}
              href={`/productions/originals/${production.slug}`}
              className="fade-in-section group"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative aspect-[16/9] overflow-hidden mb-6">
                <Image
                  src={production.thumbnail}
                  alt={production.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/60">
                    {production.genre}
                  </span>
                </div>
              </div>
              <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold tracking-[-0.02em] uppercase mb-3 group-hover:opacity-60 transition-opacity">
                {production.title}
              </h3>
              {production.description && (
                <p className="text-[12px] leading-relaxed text-white/60 uppercase tracking-[0.03em]">
                  {production.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* About Teaser */}
      <section className="px-6 lg:px-[100px] py-24 border-t border-white/10">
        <div className="fade-in-section grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-[-0.02em] leading-[1.1] uppercase mb-6">
              WE ARE A TEAM OF PASSIONATE CREATIVES ON A MISSION TO DELIVER GREAT CONTENT
            </h2>
            <Link
              href="/about"
              className="inline-block text-[11px] tracking-[0.2em] uppercase border border-white/30 px-8 py-4 hover:bg-white hover:text-black transition-all duration-300"
            >
              Learn More About Us
            </Link>
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src="https://ext.same-assets.com/3590549328/1610790658.jpeg"
              alt="Team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-[100px] py-16 border-t border-white/10">
        <Link href="/contact" className="block group">
          <h2 className="text-[clamp(3rem,12vw,10rem)] font-bold tracking-[-0.03em] uppercase transition-opacity duration-300 group-hover:opacity-50">
            LET'S WORK TOGETHER
          </h2>
        </Link>
      </section>
    </div>
  );
}
