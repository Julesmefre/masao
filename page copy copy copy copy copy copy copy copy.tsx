'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { studioProductions, studioFilters } from '@/lib/data';

export default function StudioPage() {
  const [filter, setFilter] = useState('all');

  const filteredProductions = studioProductions.filter((production) => {
    if (filter === 'all') return true;
    return production.subcategory?.toLowerCase().replace(' ', '-') === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#0c0d12]">
      {/* Header Section */}
      <section className="px-6 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-px h-8 bg-white" />
          <span className="text-xs tracking-wider opacity-70">FIRST FRAME</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">STUDIO</h1>
        <p className="text-sm opacity-70 max-w-xl leading-relaxed">
          Our in-house studio specializes in motion design, 3D animation, and title design.
          We bring creative visions to life with cutting-edge visual effects.
        </p>
      </section>

      {/* Filters */}
      <section className="px-6 py-6 border-y border-white/10">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs tracking-wider opacity-50">FILTER</span>
          <div className="flex flex-wrap gap-2">
            {studioFilters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`filter-tag ${filter === f.value ? 'active' : ''}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Productions Grid */}
      <section className="px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProductions.map((production) => (
            <Link
              key={production.id}
              href={`/production/${production.slug}?category=studio`}
              className="group"
            >
              <div className="relative aspect-video overflow-hidden mb-4">
                <Image
                  src={production.thumbnail}
                  alt={production.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Category Badge */}
                {production.subcategory && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs tracking-wider bg-white/10 backdrop-blur-sm border border-white/20">
                      {production.subcategory.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Play Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm bg-white/10">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="ml-1"
                    >
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-lg font-bold tracking-tight uppercase mb-1 group-hover:opacity-70 transition-opacity">
                  {production.title}
                </h3>
                <div className="flex items-center gap-3 text-xs tracking-wider opacity-50">
                  <span>{production.client}</span>
                  {production.year && (
                    <>
                      <span>•</span>
                      <span>{production.year}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProductions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm opacity-50">No productions found matching your filter.</p>
          </div>
        )}
      </section>

      {/* To Top */}
      <section className="px-6 py-8 border-t border-white/10">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-xs tracking-wider opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transform -rotate-90"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span>TO TOP</span>
        </button>
      </section>
    </div>
  );
}
