'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { corporateProductions, corporateFilters } from '@/lib/data';
import FilmGrain from '@/components/FilmGrain';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CorporatePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const filteredProductions = activeFilter === 'all'
    ? corporateProductions
    : corporateProductions.filter(p => p.subcategory?.toLowerCase().includes(activeFilter.toLowerCase()));

  // Initialize Lenis smooth scroll
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
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

  // Hero animation
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const title = hero.querySelector('.hero-title');
    const subtitle = hero.querySelector('.hero-subtitle');

    gsap.fromTo(title,
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo(subtitle,
      { opacity: 0, y: 30 },
      { opacity: 0.5, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      {/* Film Grain */}
      <FilmGrain opacity={0.025} />

      {/* Hero */}
      <section ref={heroRef} className="h-[60vh] flex items-end px-6 lg:px-[100px] pb-12">
        <div>
          <h1 className="hero-title text-[12vw] lg:text-[10vw] font-bold tracking-[-0.04em] leading-[0.85] uppercase">
            CORPORATE
          </h1>
          <p className="hero-subtitle text-[11px] tracking-[0.3em] uppercase mt-4 opacity-0">
            Brand Stories & Corporate Films
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 lg:px-[100px] py-8 border-b border-white/10">
        <div className="flex flex-wrap gap-3">
          {corporateFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase transition-all duration-300 ${
                activeFilter === filter.value
                  ? 'bg-white text-black'
                  : 'border border-white/20 hover:border-white/50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Productions Grid */}
      <section className="px-6 lg:px-[100px] py-16">
        <div className="space-y-[12vh] lg:space-y-[16vh]">
          {filteredProductions.map((production, index) => (
            <CorporateCard
              key={production.id}
              production={production}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </div>
      </section>

      {/* To Top */}
      <section className="px-6 lg:px-[100px] py-12 border-t border-white/10">
        <button
          type="button"
          onClick={() => lenisRef.current?.scrollTo(0)}
          className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="rotate-[-90deg]">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span>TO TOP</span>
        </button>
      </section>
    </div>
  );
}

// Corporate Card with scroll effects
interface CorporateCardProps {
  production: typeof corporateProductions[0];
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function CorporateCard({ production, index, isHovered, onHover, onLeave }: CorporateCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const getVariant = (idx: number) => {
    const patterns = ['full', 'left', 'right', 'full', 'right', 'left'];
    return patterns[idx % patterns.length];
  };
  const variant = getVariant(index);

  useEffect(() => {
    const container = containerRef.current;
    const imageContainer = imageContainerRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const meta = metaRef.current;

    if (!container || !imageContainer || !image) return;

    gsap.set(imageContainer, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(image, { scale: 1.15 });
    if (title) gsap.set(title, { opacity: 0, y: 25 });
    if (meta) gsap.set(meta, { opacity: 0, y: 15 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.to(imageContainer, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.inOut' })
      .to(image, { scale: 1, duration: 1.4, ease: 'power3.out' }, '<')
      .to(title, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
      .to(meta, { opacity: 0.6, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5');

    gsap.to(image, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: container, start: 'top bottom', end: 'bottom top', scrub: true },
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    gsap.to(image, {
      scale: isHovered ? 1.03 : 1,
      duration: isHovered ? 1.5 : 1.2,
      ease: isHovered ? 'expo.out' : 'power3.out',
    });
  }, [isHovered]);

  const containerClasses = {
    full: 'w-full',
    left: 'w-full lg:w-[48%]',
    right: 'w-full lg:w-[52%] lg:ml-auto',
  };

  return (
    <div ref={containerRef} className={containerClasses[variant as keyof typeof containerClasses]}>
      <Link
        href={`/production/${production.slug}?category=corporate`}
        className="block group play-trigger"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <div ref={imageContainerRef} className="relative aspect-video overflow-hidden">
          <div ref={imageRef} className="absolute inset-[-12%] w-[124%] h-[124%]">
            <Image src={production.thumbnail} alt={production.title} fill className="object-cover" sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/5">
              <svg width="16" height="18" viewBox="0 0 16 18" fill="white" className="ml-0.5">
                <polygon points="0,0 16,9 0,18" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div ref={titleRef}>
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase">{production.title}</h3>
          </div>
          <div ref={metaRef} className="flex items-center gap-4 mt-2">
            <span className="text-[11px] tracking-[0.15em] uppercase">{production.client}</span>
            {production.subcategory && (
              <>
                <span className="w-1 h-1 bg-white/30 rounded-full" />
                <span className="text-[11px] tracking-[0.15em] uppercase">{production.subcategory}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
