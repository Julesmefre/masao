'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  corporateProductions,
  commercialProductions,
  musicProductions,
  originalsProductions,
  studioProductions,
  type Production
} from '@/lib/data';
import MusicDetail from './music-detail';

function ProductionContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const category = searchParams.get('category') || 'corporate';

  // Find production based on slug and category
  let production: Production | null | undefined = null;
  let allProductions: Production[] = [];
  let backLink = '/productions/corporate';

  switch (category) {
    case 'corporate':
      production = corporateProductions.find(p => p.slug === slug);
      allProductions = corporateProductions;
      backLink = '/productions/corporate';
      break;
    case 'commercial':
      production = commercialProductions.find(p => p.slug === slug);
      allProductions = commercialProductions;
      backLink = '/productions/commercial';
      break;
    case 'music':
      production = musicProductions.find(p => p.slug === slug);
      allProductions = musicProductions;
      backLink = '/productions/music';
      break;
    case 'originals':
      production = originalsProductions.find(p => p.slug === slug);
      allProductions = originalsProductions;
      backLink = '/productions/originals';
      break;
    case 'studio':
      production = studioProductions.find(p => p.slug === slug);
      allProductions = studioProductions;
      backLink = '/productions/studio';
      break;
    default:
      production = corporateProductions.find(p => p.slug === slug);
      allProductions = corporateProductions;
  }

  // Get next production
  const currentIndex = allProductions.findIndex(p => p.slug === slug);
  const nextProduction = allProductions[(currentIndex + 1) % allProductions.length];

  if (!production) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p>Production not found</p>
      </div>
    );
  }

  // Use MusicDetail component for music category
  if (category === 'music') {
    return <MusicDetail production={production} nextProduction={nextProduction} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={production.thumbnail}
            alt={production.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button type="button" className="w-24 h-24 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="absolute top-24 left-6 lg:left-[100px] right-6 lg:right-[100px] z-10 flex justify-between items-start">
          <Link
            href={backLink}
            className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="w-px h-4 bg-white" />
            <span>Back</span>
          </Link>

          <Link
            href={`/production/${nextProduction.slug}?category=${category}`}
            className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-opacity"
          >
            <span>Next project</span>
            <div className="relative w-20 h-14 overflow-hidden">
              <Image
                src={nextProduction.thumbnail}
                alt={nextProduction.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* Title Section */}
      <section className="px-6 lg:px-[100px] py-12 border-b border-white/10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-[-0.02em] uppercase mb-4">
          {production.title}
        </h1>
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1.5 border border-white/30 text-[11px] tracking-[0.15em] uppercase">
            {production.client}
          </span>
          {production.subcategory && (
            <span className="text-[11px] tracking-[0.15em] uppercase opacity-50">
              {production.subcategory}
            </span>
          )}
        </div>
      </section>

      {/* Gallery */}
      {production.images && production.images.length > 0 && (
        <section className="px-6 lg:px-[100px] py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {production.images.map((image, index) => (
              <div
                key={`image-${index}`}
                className="relative aspect-video overflow-hidden group"
              >
                <Image
                  src={image}
                  alt={`${production.title} - ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm bg-white/10">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="ml-1">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Credits Section */}
      <section className="px-6 lg:px-[100px] py-12 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-4xl">
          <div>
            <h3 className="text-[11px] tracking-[0.15em] uppercase opacity-50 mb-2">Project</h3>
            <p className="text-xl font-bold">{production.title}</p>
          </div>
          <div>
            <h3 className="text-[11px] tracking-[0.15em] uppercase opacity-50 mb-2">Client</h3>
            <p className="text-xl">{production.client}</p>
          </div>
          <div>
            <h3 className="text-[11px] tracking-[0.15em] uppercase opacity-50 mb-2">Category</h3>
            <Link
              href={backLink}
              className="text-xl capitalize hover:opacity-70 transition-opacity"
            >
              {category}
            </Link>
          </div>
          {production.year && (
            <div>
              <h3 className="text-[11px] tracking-[0.15em] uppercase opacity-50 mb-2">Year</h3>
              <p className="text-xl">{production.year}</p>
            </div>
          )}
          {production.director && (
            <div>
              <h3 className="text-[11px] tracking-[0.15em] uppercase opacity-50 mb-2">Director</h3>
              <p className="text-xl">{production.director}</p>
            </div>
          )}
          <div>
            <h3 className="text-[11px] tracking-[0.15em] uppercase opacity-50 mb-2">Production</h3>
            <p className="text-xl">First Frame</p>
          </div>
        </div>

        {production.description && (
          <div className="mt-12 max-w-2xl">
            <h3 className="text-lg font-bold uppercase mb-4">
              {production.client} x FIRST FRAME
            </h3>
            <p className="text-sm opacity-70 leading-relaxed">{production.description}</p>
          </div>
        )}
      </section>

      {/* To Top */}
      <section className="px-6 lg:px-[100px] py-8 border-t border-white/10">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="rotate-[-90deg]">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span>To Top</span>
        </button>
      </section>
    </div>
  );
}

export default function ProductionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-[11px] tracking-[0.2em] uppercase opacity-50">Loading...</p>
      </div>
    }>
      <ProductionContent />
    </Suspense>
  );
}
