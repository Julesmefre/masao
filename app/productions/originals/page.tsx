'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { originalsProductions, originalsFilters, originalsStatusFilters } from '@/lib/data';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function OriginalsPage() {
  const [genreFilter, setGenreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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
            delay: i * 0.08,
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [genreFilter, statusFilter]);

  const filteredProductions = originalsProductions.filter(p => {
    const matchesGenre = genreFilter === 'all' || p.genre?.toLowerCase() === genreFilter;
    const matchesStatus = statusFilter === 'all' || p.status?.toLowerCase().replace(/\s+/g, '-') === statusFilter;
    return matchesGenre && matchesStatus;
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-black pt-32 pb-20">
      <div className="px-6 lg:px-[100px]">
        <h1 className="page-title text-[clamp(3rem,10vw,8rem)] font-bold tracking-[-0.03em] leading-[0.9] uppercase mb-12">
          Originals
        </h1>

        <div className="mb-8">
          <div className="text-[11px] tracking-[0.15em] uppercase text-white/40 mb-3">Genre</div>
          <div className="flex flex-wrap gap-4 mb-8">
            {originalsFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setGenreFilter(filter.value)}
                className={`text-[11px] tracking-[0.15em] uppercase px-6 py-3 border transition-all duration-300 ${
                  genreFilter === filter.value
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/60 border-white/20 hover:text-white hover:border-white/40'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <div className="text-[11px] tracking-[0.15em] uppercase text-white/40 mb-3">Status</div>
          <div className="flex flex-wrap gap-4">
            {originalsStatusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={`text-[11px] tracking-[0.15em] uppercase px-6 py-3 border transition-all duration-300 ${
                  statusFilter === filter.value
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/60 border-white/20 hover:text-white hover:border-white/40'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {filteredProductions.map((production) => (
            <Link
              key={production.id}
              href={`/productions/originals/${production.slug}`}
              className="production-card group"
            >
              <div className="relative aspect-[16/9] overflow-hidden mb-6">
                <Image
                  src={production.thumbnail}
                  alt={production.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-4">
                  {production.genre && (
                    <span className="text-[10px] tracking-[0.2em] uppercase text-white/60">
                      {production.genre}
                    </span>
                  )}
                  {production.status && (
                    <>
                      <span className="w-1 h-1 bg-white/30 rounded-full" />
                      <span className="text-[10px] tracking-[0.2em] uppercase text-white/60">
                        {production.status}
                      </span>
                    </>
                  )}
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
      </div>
    </div>
  );
}
