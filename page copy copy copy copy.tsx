'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { commercialProductions, commercialFilters } from '@/lib/data';

const directors = [
  'Matt Palmer', 'Rafael Covo', 'Bastien Fiche', 'Antoine Hmono',
  'Alexis Berg', 'Emilio Boutros', 'Thomas Viard', 'Las Favoritas',
  'Thierry Le Mer', 'Nathan Cahen', 'Matt Rendell', 'Ivan Olita',
];

export default function CommercialPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeDirector, setActiveDirector] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDirectors, setShowDirectors] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Filter productions
  const filteredProductions = commercialProductions.filter(p => {
    const matchesFilter = activeFilter === 'all' || p.subcategory?.toLowerCase().includes(activeFilter.toLowerCase());
    const matchesDirector = !activeDirector || p.director === activeDirector;
    return matchesFilter && matchesDirector;
  });

  const currentProduction = filteredProductions[currentIndex] || commercialProductions[0];

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

    tl.fromTo('.production-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
      '-=0.4'
    );
  }, []);

  const handleCardHover = (index: number) => {
    setCurrentIndex(index);
    setIsHovering(true);
  };

  const handleCardLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={currentProduction.thumbnail}
          alt={currentProduction.title}
          fill
          className="object-cover transition-opacity duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
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
          href={`/production/${currentProduction.slug}?category=commercial`}
          className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-500 group"
        >
          <svg width="20" height="24" viewBox="0 0 20 24" fill="white" className="ml-1 group-hover:scale-110 transition-transform duration-300">
            <polygon points="0,0 20,12 0,24" />
          </svg>
        </Link>
      </div>

      {/* Filters - Bottom Left */}
      <div className="filter-section absolute bottom-[140px] lg:bottom-[160px] left-6 lg:left-[60px] z-20 flex flex-col gap-4">
        {/* Genre Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowFilters(!showFilters);
              setShowDirectors(false);
            }}
            className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase"
          >
            <span className="opacity-50">Genre /</span>
            <span className="text-white">{commercialFilters.find(f => f.value === activeFilter)?.label || 'All'}</span>
          </button>

          {showFilters && (
            <div className="absolute bottom-full left-0 mb-3 bg-black/95 border border-white/10 backdrop-blur-md min-w-[160px]">
              {commercialFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setActiveFilter(filter.value);
                    setShowFilters(false);
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

        {/* Directors Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowDirectors(!showDirectors);
              setShowFilters(false);
            }}
            className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase"
          >
            <span className="opacity-50">Directors /</span>
            <span className="text-white">{activeDirector || 'All'}</span>
          </button>

          {showDirectors && (
            <div className="absolute bottom-full left-0 mb-3 bg-black/95 border border-white/10 backdrop-blur-md min-w-[180px] max-h-[300px] overflow-y-auto hide-scrollbar">
              <button
                type="button"
                onClick={() => {
                  setActiveDirector(null);
                  setShowDirectors(false);
                  setCurrentIndex(0);
                }}
                className={`block w-full px-4 py-2.5 text-left text-[11px] tracking-[0.15em] uppercase transition-colors ${
                  !activeDirector ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                All
              </button>
              {directors.map((director) => (
                <button
                  key={director}
                  type="button"
                  onClick={() => {
                    setActiveDirector(director);
                    setShowDirectors(false);
                    setCurrentIndex(0);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-[11px] tracking-[0.15em] uppercase transition-colors ${
                    activeDirector === director ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {director}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Production Cards - Horizontal Scroll */}
      <div className="absolute bottom-[40px] lg:bottom-[50px] left-0 right-0 z-20">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-6 lg:px-[60px] pb-4 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {filteredProductions.map((production, index) => (
            <Link
              key={production.id}
              href={`/production/${production.slug}?category=commercial`}
              className="production-card flex-shrink-0 w-[280px] lg:w-[320px] group play-trigger"
              style={{ scrollSnapAlign: 'start' }}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={handleCardLeave}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden mb-3 bg-[#111]">
                <Image
                  src={production.thumbnail}
                  alt={production.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center bg-black/40 backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="white" className="ml-0.5">
                      <polygon points="0,0 14,8 0,16" />
                    </svg>
                  </div>
                </div>

                {/* Active indicator */}
                {currentIndex === index && (
                  <div className="absolute bottom-3 right-3 w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-1">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">
                  {production.client}
                </p>
                <h3 className="text-[13px] font-medium tracking-tight uppercase leading-tight line-clamp-1">
                  {production.title}
                </h3>
                {production.director && (
                  <p className="text-[10px] tracking-[0.15em] text-white/30">
                    {production.director}
                  </p>
                )}
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
