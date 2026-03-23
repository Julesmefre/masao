'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Production } from '@/lib/data';

interface ProductionCardProps {
  production: Production;
}

export default function ProductionCard({ production }: ProductionCardProps) {
  return (
    <Link
      href={`/production/${production.slug}?category=${production.category}`}
      className="production-card group block relative aspect-video w-full"
    >
      <Image
        src={production.thumbnail}
        alt={production.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <span className="inline-block px-2 py-1 bg-white/10 backdrop-blur-sm text-xs tracking-wider mb-2 border border-white/20">
          {production.client}
        </span>
        <h3 className="text-lg font-bold tracking-tight">{production.title}</h3>
        {production.director && (
          <p className="text-xs opacity-70 mt-1">{production.director}</p>
        )}
      </div>

      {/* Play button on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
    </Link>
  );
}
