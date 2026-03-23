'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { musicProductions } from '@/lib/data';

export default function MusicPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const cdRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Documentary', value: 'documentary' },
  ];

  const filteredProductions = activeFilter === 'all'
    ? musicProductions
    : musicProductions.filter(p => p.subcategory?.toLowerCase().includes(activeFilter.toLowerCase()));

  const currentProduction = filteredProductions[currentIndex] || musicProductions[0];
  const cdArtwork = currentProduction.thumbnail;

  // Horizontal scroll with wheel
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY * 2;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // CD spin animation
  useEffect(() => {
    if (cdRef.current) {
      if (isPlaying) {
        gsap.to(cdRef.current, {
          rotation: '+=360',
          duration: 3,
          ease: 'none',
          repeat: -1,
        });
      } else {
        gsap.killTweensOf(cdRef.current);
      }
    }
  }, [isPlaying]);

  // Entry animation
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo('.cd-case',
      { opacity: 0, scale: 0.9, rotateY: -15 },
      { opacity: 1, scale: 1, rotateY: 0, duration: 1.4, ease: 'power3.out' }
    );

    tl.fromTo('.music-counter',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.8'
    );

    tl.fromTo('.music-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
      '-=0.4'
    );
  }, []);

  // CD light animation
  useEffect(() => {
    const lightElement = document.querySelector('.cd-light');
    if (lightElement) {
      gsap.to(lightElement, {
        rotation: 360,
        duration: 8,
        ease: 'none',
        repeat: -1,
      });
    }
  }, []);

  const handleCardHover = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div ref={containerRef} className="h-screen w-full bg-black overflow-hidden relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-black to-[#050510]" />

      {/* CD Case Hero - Center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="cd-case relative w-[70vh] h-[70vh] max-w-[600px] max-h-[600px]" style={{ perspective: '1000px' }}>
          {/* CD Case Container */}
          <div className="absolute inset-0 flex" style={{ transformStyle: 'preserve-3d' }}>
            {/* Left side - CD case hinge */}
            <div className="w-[12%] h-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2a2a2a] via-[#1a1a1a] to-[#0f0f0f]" />
              {/* Hinge details */}
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-3 h-[70%] bg-gradient-to-r from-[#444] via-[#333] to-[#222] rounded-full shadow-inner" />
              <div className="absolute top-[20%] right-0 w-1 h-[60%] bg-[#1a1a1a]" />
            </div>

            {/* Right side - CD holder */}
            <div className="flex-1 h-full relative overflow-hidden rounded-r-sm">
              {/* Plastic background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#050505]" />

              {/* CD disc */}
              <div
                ref={cdRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] aspect-square rounded-full"
                style={{ transformOrigin: 'center center' }}
              >
                {/* CD base layer */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a1a2a] via-[#15151f] to-[#0a0a15] shadow-2xl" />

                {/* Album artwork */}
                <div className="absolute inset-[8%] rounded-full overflow-hidden">
                  <Image
                    src={cdArtwork}
                    alt={currentProduction.title}
                    fill
                    className="object-cover"
                  />
                  {/* Artwork overlay for CD effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40 rounded-full" />
                </div>

                {/* CD grooves/rings */}
                <div className="absolute inset-[5%] rounded-full border border-white/[0.03]" />
                <div className="absolute inset-[20%] rounded-full border border-white/[0.05]" />
                <div className="absolute inset-[35%] rounded-full border border-white/[0.03]" />

                {/* Center hole */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[12%] aspect-square rounded-full bg-[#080808] border-2 border-[#1a1a1a] shadow-inner" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8%] aspect-square rounded-full bg-[#0a0a0a]" />

                {/* Realistic light reflections */}
                <div className="cd-light absolute inset-0 rounded-full pointer-events-none">
                  {/* Rainbow reflection */}
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,100,100,0.08)_30deg,rgba(255,200,100,0.08)_60deg,rgba(100,255,100,0.08)_90deg,rgba(100,200,255,0.08)_120deg,rgba(150,100,255,0.08)_150deg,transparent_180deg,rgba(255,100,100,0.08)_210deg,rgba(255,200,100,0.08)_240deg,rgba(100,255,100,0.08)_270deg,rgba(100,200,255,0.08)_300deg,rgba(150,100,255,0.08)_330deg,transparent_360deg)]" />
                  {/* Shine streak */}
                  <div className="absolute top-[10%] left-[20%] w-[40%] h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-[-30deg] blur-[1px]" />
                  <div className="absolute top-[15%] left-[25%] w-[30%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-[-30deg]" />
                </div>

                {/* Edge highlight */}
                <div className="absolute inset-0 rounded-full border border-white/10" />
              </div>

              {/* Case plastic overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-black/20 pointer-events-none" />

              {/* Right edge of case */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-[#222] to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-px bg-[#333]" />
            </div>
          </div>
        </div>
      </div>

      {/* Counter - Top Left */}
      <div className="music-counter absolute top-24 left-6 lg:left-[100px] z-20 flex items-center gap-3">
        <div className="w-px h-5 bg-white" />
        <span className="text-[13px] tracking-[0.15em] font-light">
          {String(currentIndex + 1).padStart(2, '0')} / {String(filteredProductions.length).padStart(2, '0')}
        </span>
      </div>

      {/* Play Button - Center Left */}
      <button
        type="button"
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-1/2 left-6 lg:left-[100px] -translate-y-1/2 z-20 flex items-center gap-4 group pointer-events-auto"
      >
        <div className={`w-14 h-14 rounded-full border border-white/30 flex items-center justify-center transition-all duration-500 ${isPlaying ? 'bg-white/10 border-white/50' : 'bg-transparent hover:bg-white/5 hover:border-white/50'}`}>
          {isPlaying ? (
            <div className="flex gap-1.5">
              <div className="w-1 h-5 bg-white rounded-full" />
              <div className="w-1 h-5 bg-white rounded-full" />
            </div>
          ) : (
            <svg width="16" height="18" viewBox="0 0 16 18" fill="white" className="ml-1">
              <polygon points="0,0 16,9 0,18" />
            </svg>
          )}
        </div>
        <span className="text-[11px] tracking-[0.2em] uppercase opacity-50 group-hover:opacity-100 transition-opacity hidden lg:block">
          {isPlaying ? 'Pause' : 'Play'}
        </span>
      </button>

      {/* Filters - Bottom Left */}
      <div className="absolute bottom-8 left-6 lg:left-[100px] z-20">
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase opacity-60 hover:opacity-100 transition-opacity"
          >
            <span>Filters</span>
            <span className="text-white/30">/</span>
            <span className="text-white">{filters.find(f => f.value === activeFilter)?.label}</span>
          </button>

          {filterOpen && (
            <div className="absolute bottom-full left-0 mb-3 bg-black/95 border border-white/10 backdrop-blur-md min-w-[140px]">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter.value);
                    setFilterOpen(false);
                    setCurrentIndex(0);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-[11px] tracking-[0.15em] uppercase transition-colors ${
                    activeFilter === filter.value ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Album Cards - Horizontal Scroll */}
      <div className="absolute bottom-[90px] left-0 right-0 z-20">
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto hide-scrollbar px-6 lg:px-[100px] pb-4 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
        >
          {filteredProductions.map((production, index) => (
            <Link
              key={production.id}
              href={`/production/${production.slug}?category=music`}
              className="music-card flex-shrink-0 w-[240px] lg:w-[280px] group"
              style={{ scrollSnapAlign: 'start' }}
              onMouseEnter={() => handleCardHover(index)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-[#111]">
                <Image
                  src={production.thumbnail}
                  alt={production.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-11 h-11 rounded-full border border-white/50 flex items-center justify-center bg-black/40 backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                    <svg width="12" height="14" viewBox="0 0 12 14" fill="white" className="ml-0.5">
                      <polygon points="0,0 12,7 0,14" />
                    </svg>
                  </div>
                </div>

                {/* Active indicator */}
                {currentIndex === index && (
                  <div className="absolute bottom-3 right-3 w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-1.5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">
                  {production.client}
                </p>
                <h3 className="text-[13px] font-medium tracking-tight uppercase leading-tight line-clamp-1">
                  {production.title}
                </h3>
                <p className="text-[10px] tracking-[0.15em] text-white/30">
                  {production.director}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll indicator - Bottom Right */}
      <div className="absolute bottom-8 right-6 lg:right-[100px] z-20 flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 mr-4">
          <div className="w-8 h-px bg-white/30" />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <span className="text-[11px] tracking-[0.2em] uppercase opacity-40">Scroll</span>
      </div>
    </div>
  );
}
