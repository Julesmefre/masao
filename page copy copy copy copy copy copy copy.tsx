'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { originalsProductions, originalsFilters, originalsStatusFilters } from '@/lib/data';

export default function OriginalsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeGenre, setActiveGenre] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [showGenreFilters, setShowGenreFilters] = useState(false);
  const [showStatusFilters, setShowStatusFilters] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter productions
  const filteredProductions = originalsProductions.filter(p => {
    const matchesGenre = activeGenre === 'all' || p.genre?.toLowerCase().includes(activeGenre.toLowerCase());
    const matchesStatus = activeStatus === 'all' || p.status?.toLowerCase().includes(activeStatus.replace('-', ' ').toLowerCase());
    return matchesGenre && matchesStatus;
  });

  const currentProduction = filteredProductions[currentIndex] || originalsProductions[0];

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

  // Entry animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo('.hero-counter',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    tl.fromTo('.filter-section',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );

    tl.fromTo('.originals-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
      '-=0.4'
    );
  }, []);

  const handleCardHover = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={currentProduction.thumbnail}
          alt={currentProduction.title}
          fill
          className="object-cover transition-all duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
      </div>

      {/* Vertical line */}
      <div className="absolute left-[45px] top-16 bottom-16 w-px bg-white/10 hidden lg:block z-10" />

      {/* Counter - Top Left */}
      <div className="hero-counter absolute top-24 left-6 lg:left-[60px] z-20 flex items-center gap-4">
        <div className="w-px h-5 bg-white" />
        <span className="text-[13px] tracking-[0.15em] font-light">
          {String(currentIndex + 1).padStart(2, '0')} / {String(filteredProductions.length).padStart(2, '0')}
        </span>
      </div>

      {/* Play Button - Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 play-trigger">
        <Link
          href={`/production/${currentProduction.slug}?category=originals`}
          className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-500 group"
        >
          <svg width="20" height="24" viewBox="0 0 20 24" fill="white" className="ml-1 group-hover:scale-110 transition-transform duration-300">
            <polygon points="0,0 20,12 0,24" />
          </svg>
        </Link>
      </div>

      {/* Filters - Bottom Left */}
      <div className="filter-section absolute bottom-[200px] lg:bottom-[220px] left-6 lg:left-[60px] z-20 flex flex-col gap-4">
        {/* Genre Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowGenreFilters(!showGenreFilters);
              setShowStatusFilters(false);
            }}
            className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase"
          >
            <span className="opacity-50">Genre /</span>
            <span className="text-white">{originalsFilters.find(f => f.value === activeGenre)?.label || 'All'}</span>
          </button>

          {showGenreFilters && (
            <div className="absolute bottom-full left-0 mb-3 bg-black/95 border border-white/10 backdrop-blur-md min-w-[160px]">
              {originalsFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setActiveGenre(filter.value);
                    setShowGenreFilters(false);
                    setCurrentIndex(0);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-[11px] tracking-[0.15em] uppercase transition-colors ${
                    activeGenre === filter.value ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowStatusFilters(!showStatusFilters);
              setShowGenreFilters(false);
            }}
            className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase"
          >
            <span className="opacity-50">Status /</span>
            <span className="text-white">{originalsStatusFilters.find(f => f.value === activeStatus)?.label || 'All'}</span>
          </button>

          {showStatusFilters && (
            <div className="absolute bottom-full left-0 mb-3 bg-black/95 border border-white/10 backdrop-blur-md min-w-[160px]">
              {originalsStatusFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setActiveStatus(filter.value);
                    setShowStatusFilters(false);
                    setCurrentIndex(0);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-[11px] tracking-[0.15em] uppercase transition-colors ${
                    activeStatus === filter.value ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vertical Cards - Horizontal Scroll */}
      <div className="absolute bottom-[40px] lg:bottom-[50px] left-0 right-0 z-20">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-6 lg:px-[60px] pb-4 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {filteredProductions.map((production, index) => (
            <Link
              key={production.id}
              href={`/production/${production.slug}?category=originals`}
              className="originals-card flex-shrink-0 w-[180px] lg:w-[220px] group play-trigger"
              style={{ scrollSnapAlign: 'start' }}
              onMouseEnter={() => handleCardHover(index)}
            >
              {/* Vertical Thumbnail */}
              <div className="relative aspect-[9/14] overflow-hidden mb-3 bg-[#111]">
                <Image
                  src={production.thumbnail}
                  alt={production.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-14 h-14 rounded-full border border-white/50 flex items-center justify-center bg-black/40 backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="white" className="ml-0.5">
                      <polygon points="0,0 14,8 0,16" />
                    </svg>
                  </div>
                </div>

                {/* Status badge */}
                {production.status && (
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-[8px] tracking-[0.1em] uppercase ${
                      production.status === 'Released' ? 'bg-white text-black' : 'bg-white/20 text-white backdrop-blur-sm'
                    }`}>
                      {production.status}
                    </span>
                  </div>
                )}

                {/* Active indicator */}
                {currentIndex === index && (
                  <div className="absolute bottom-3 right-3 w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50" />
                )}

                {/* Title overlay on card */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg lg:text-xl font-bold tracking-tight uppercase leading-tight">
                    {production.title}
                  </h3>
                  <p className="text-[10px] tracking-[0.15em] text-white/60 mt-1">
                    {production.director || production.client}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Scroll indicator - Bottom Right */}
      <div className="absolute bottom-[50px] right-6 lg:right-[60px] z-20 flex items-center gap-3">
        <span className="text-[11px] tracking-[0.2em] uppercase opacity-40">Scroll</span>
      </div>
    </div>
  );
}
