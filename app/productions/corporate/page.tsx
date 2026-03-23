'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { corporateProductions, corporateFilters } from '@/lib/data';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CorporatePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

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

    lenisRef.current.on('scroll', ScrollTrigger.update);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.page-title',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
      );

      gsap.utils.toArray<HTMLElement>('.production-card').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            delay: i * 0.05,
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeFilter]);

  const filteredProductions = activeFilter === 'all'
    ? corporateProductions
    : corporateProductions.filter(p =>
        p.subcategory?.toLowerCase().replace(/\s+/g, '-') === activeFilter
      );

  return (
    <div ref={containerRef} className="min-h-screen bg-black pt-32 pb-20">
      <div className="px-6 lg:px-[100px]">
        <h1 className="page-title text-[clamp(3rem,10vw,8rem)] font-bold tracking-[-0.03em] leading-[0.9] uppercase mb-12">
          Corporate
        </h1>

        <div className="flex flex-wrap gap-4 mb-16">
          {corporateFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`text-[11px] tracking-[0.15em] uppercase px-6 py-3 border transition-all duration-300 ${
                activeFilter === filter.value
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/60 border-white/20 hover:text-white hover:border-white/40'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProductions.map((production) => (
            <Link
              key={production.id}
              href={`/productions/corporate/${production.slug}`}
              className="production-card group"
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
              <h3 className="text-[18px] font-bold tracking-[-0.01em] uppercase mb-2 group-hover:opacity-60 transition-opacity">
                {production.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-[11px] tracking-[0.1em] text-white/50">
                <span>{production.client}</span>
                {production.subcategory && (
                  <>
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span>{production.subcategory}</span>
                  </>
                )}
                {production.year && (
                  <>
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span>{production.year}</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
