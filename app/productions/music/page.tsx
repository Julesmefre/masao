'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { musicProductions } from '@/lib/data';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MusicPage() {
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
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black pt-32 pb-20">
      <div className="px-6 lg:px-[100px]">
        <h1 className="page-title text-[clamp(3rem,10vw,8rem)] font-bold tracking-[-0.03em] leading-[0.9] uppercase mb-12">
          Music
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {musicProductions.map((production) => (
            <Link
              key={production.id}
              href={`/productions/music/${production.slug}`}
              className="production-card group"
            >
              <div className="relative aspect-[16/9] overflow-hidden mb-6">
                <Image
                  src={production.thumbnail}
                  alt={production.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold tracking-[-0.02em] uppercase mb-3 group-hover:opacity-60 transition-opacity">
                {production.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-[12px] tracking-[0.08em] text-white/60">
                <span>{production.client}</span>
                {production.director && (
                  <>
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span>{production.director}</span>
                  </>
                )}
                {production.year && (
                  <>
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span>{production.year}</span>
                  </>
                )}
              </div>
              {production.tracks && (
                <div className="mt-4 text-[11px] text-white/40 tracking-[0.1em]">
                  {production.tracks.length} tracks
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
