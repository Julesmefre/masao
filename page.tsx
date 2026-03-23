'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { services, clientLogos } from '@/lib/data';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = [
  { name: 'ADVERTISEMENT', href: '/productions/commercial', image: 'https://ext.same-assets.com/3590549328/2826541438.jpeg', video: 'https://ext.same-assets.com/3590549328/4189926807.mp4' },
  { name: 'BRAND CONTENT', href: '/productions/commercial/brand-content', image: 'https://ext.same-assets.com/3590549328/1203587910.jpeg' },
  { name: 'DOCUMENTARIES', href: '/productions/originals', image: 'https://ext.same-assets.com/3590549328/2904043732.jpeg' },
  { name: 'SOCIAL MEDIA', href: '/productions/commercial/social-media', image: 'https://ext.same-assets.com/3590549328/1297949603.png' },
  { name: 'CORPORATE', href: '/productions/corporate', image: 'https://ext.same-assets.com/3590549328/3886320075.jpeg' },
];

const galleryImages = [
  'https://ext.same-assets.com/3590549328/2986805740.jpeg',
  'https://ext.same-assets.com/3590549328/2071619291.jpeg',
  'https://ext.same-assets.com/3590549328/4255327141.jpeg',
  'https://ext.same-assets.com/3590549328/824790869.jpeg',
  'https://ext.same-assets.com/3590549328/962338260.jpeg',
  'https://ext.same-assets.com/3590549328/1032639646.jpeg',
  'https://ext.same-assets.com/3590549328/1811997017.jpeg',
  'https://ext.same-assets.com/3590549328/2430637036.jpeg',
  'https://ext.same-assets.com/3590549328/3372107071.jpeg',
  'https://ext.same-assets.com/3590549328/2325433122.jpeg',
  'https://ext.same-assets.com/3590549328/1694581682.jpeg',
  'https://ext.same-assets.com/3590549328/3975113842.jpeg',
  'https://ext.same-assets.com/3590549328/186611905.jpeg',
  'https://ext.same-assets.com/3590549328/2539342009.jpeg',
];

const ecoLogos = [
  'https://ext.same-assets.com/3590549328/4093412123.png',
  'https://ext.same-assets.com/3590549328/3502723690.png',
  'https://ext.same-assets.com/3590549328/169479300.png',
];

export default function AboutPage() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 2.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.6,
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

  // Scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title animation
      gsap.fromTo('.hero-title',
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: 0.3 }
      );

      // Animate sections on scroll
      gsap.utils.toArray<HTMLElement>('.fade-in-section').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        );
      });

      // Category links animation
      gsap.utils.toArray<HTMLElement>('.category-link').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            delay: i * 0.1,
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const nextGalleryImage = () => {
    setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevGalleryImage = () => {
    setGalleryIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      {/* Hero - ABOUT Title */}
      <section className="pt-20 pb-4 px-6 lg:px-[60px] relative">
        {/* Vertical line */}
        <div className="absolute left-[45px] top-16 bottom-0 w-px bg-white/10 hidden lg:block" />

        <h1 className="hero-title text-[25vw] lg:text-[22vw] font-bold tracking-[-0.04em] leading-[0.85] uppercase">
          ABOUT
        </h1>
      </section>

      {/* Section 01 - Who We Are */}
      <section className="px-6 lg:px-[60px] py-8 relative">
        <div className="absolute left-[45px] top-0 bottom-0 w-px bg-white/10 hidden lg:block" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left - Text */}
          <div className="fade-in-section relative">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span className="text-[11px] tracking-[0.2em] text-white/50">01</span>
              <span className="text-[11px] tracking-[0.25em] uppercase text-white/50">Who we are</span>
            </div>
            <h2 className="text-[clamp(1.8rem,5vw,3rem)] font-bold tracking-[-0.02em] leading-[1.1] uppercase">
              WE ARE A TEAM OF PASSIONATE CREATIVES, PRODUCERS AND DIRECTORS, ON A MISSION TO DELIVER GREAT CONTENT
            </h2>
            <div className="mt-8 text-[11px] tracking-[0.15em] text-white/30 hidden lg:block">
              Scroll
            </div>
          </div>

          {/* Right - Image */}
          <div className="fade-in-section relative aspect-[4/3]">
            <Image
              src="https://ext.same-assets.com/3590549328/1610790658.jpeg"
              alt="Team"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Description with Image - Reversed */}
      <section className="px-6 lg:px-[60px] py-16 relative">
        <div className="absolute left-[45px] top-0 bottom-0 w-px bg-white/10 hidden lg:block" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left - Image */}
          <div className="fade-in-section relative aspect-[3/4] lg:aspect-auto lg:h-[550px]">
            <Image
              src="https://ext.same-assets.com/3590549328/1203587910.jpeg"
              alt="Production"
              fill
              className="object-cover"
            />
          </div>

          {/* Right - Text */}
          <div className="fade-in-section flex flex-col justify-center">
            <p className="text-[12px] leading-[2] text-white/60 uppercase tracking-[0.05em]">
              Founded by two brothers sharing the same passion & complementary visions,{' '}
              <strong className="text-white font-normal">
                we produce a wide range of content for various mediums / formats and audiences,
              </strong>{' '}
              exploring content creation with care and dedication.
            </p>
            <p className="text-[12px] leading-[2] text-white/60 uppercase tracking-[0.05em] mt-6">
              We develop & produce{' '}
              <strong className="text-white font-normal">original ideas / projects for TV and platforms</strong>{' '}
              as well as offering{' '}
              <strong className="text-white font-normal">production services for local or global brands & agencies.</strong>
            </p>
            <div className="mt-12 flex items-center gap-6">
              <span className="text-[11px] tracking-[0.1em] text-white/30">Iso: 200</span>
              <div className="flex gap-1">
                <svg width="24" height="16" viewBox="0 0 24 16" className="opacity-30">
                  <rect x="0" y="0" width="6" height="16" fill="white" />
                  <rect x="8" y="0" width="6" height="16" fill="white" />
                  <rect x="16" y="0" width="6" height="16" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02 - What We Do */}
      <section className="px-6 lg:px-[60px] py-16 relative">
        <div className="absolute left-[45px] top-0 bottom-0 w-px bg-white/10 hidden lg:block" />

        <div className="fade-in-section mb-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-1 h-1 bg-white rounded-full" />
            <span className="text-[11px] tracking-[0.2em] text-white/50">02</span>
            <span className="text-[11px] tracking-[0.25em] uppercase text-white/50">What we do</span>
          </div>
          <h2 className="text-[clamp(1.4rem,3.5vw,2.2rem)] font-bold tracking-[-0.02em] leading-[1.2] uppercase max-w-4xl">
            WE LEVERAGE THE NEXT GENERATION OF CREATIVES TO CRAFT MEMORABLE EXPERIENCES THROUGH IMAGERY AND STORYTELLING FOR :
          </h2>
        </div>

        {/* Category Links with Hover Images */}
        <div className="space-y-1 lg:ml-16">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="category-link block group relative py-1"
              onMouseEnter={() => setHoveredCategory(category.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="flex items-center gap-4">
                <div className="w-1 h-1 bg-white/30 group-hover:bg-white transition-colors flex-shrink-0" />
                <h3 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold tracking-[-0.03em] uppercase transition-opacity duration-300 group-hover:opacity-60">
                  {category.name}
                </h3>
                {/* Hover Image */}
                <div className={`relative w-[180px] h-[100px] overflow-hidden transition-all duration-500 flex-shrink-0 ${
                  hoveredCategory === category.name ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 24/s indicator */}
        <div className="flex justify-end mt-8 pr-4">
          <span className="text-[11px] tracking-[0.1em] text-white/30">24/s</span>
        </div>
      </section>

      {/* Section 03 - Our Services */}
      <section className="px-6 lg:px-[60px] py-16 relative">
        <div className="absolute left-[45px] top-0 bottom-0 w-px bg-white/10 hidden lg:block" />

        <div className="fade-in-section grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12">
          <div>
            <div className="flex items-center gap-6 mb-6">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span className="text-[11px] tracking-[0.2em] text-white/50">03</span>
              <span className="text-[11px] tracking-[0.25em] uppercase text-white/50">Our services</span>
            </div>
          </div>
          <div>
            <h2 className="text-[clamp(1.2rem,2.5vw,1.6rem)] font-bold tracking-[-0.01em] leading-[1.3] uppercase">
              WE OFFER A WIDE RANGE OF CREATIVE & TECHNICAL SERVICES THAT COVERS EVERY STEPS OF A PRODUCTION & POST-PRODUCTION PIPELINE
            </h2>
          </div>
        </div>

        {/* Services List */}
        <div className="lg:ml-16">
          {services.map((service) => (
            <div key={service.number} className="fade-in-section grid grid-cols-1 lg:grid-cols-12 gap-4 py-6 border-t border-white/10">
              <div className="lg:col-span-3 flex items-start gap-4">
                <span className="text-[13px] tracking-[0.1em] text-white/40">{service.number}</span>
                <h3 className="text-[14px] font-bold tracking-[0.02em] uppercase">{service.title}</h3>
              </div>
              <div className="lg:col-span-6 lg:col-start-5">
                <ul className="space-y-1.5">
                  {service.items.map((item) => (
                    <li key={item} className="text-[11px] text-white/50 leading-relaxed flex items-start gap-3 uppercase tracking-[0.03em]">
                      <span className="w-1 h-1 bg-white/30 mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Carousel */}
      <section className="py-8 relative">
        <div className="absolute left-[45px] top-0 bottom-0 w-px bg-white/10 hidden lg:block" />

        <div className="relative aspect-[16/9] max-h-[65vh] overflow-hidden">
          <Image
            src={galleryImages[galleryIndex]}
            alt={`Gallery ${galleryIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
        <div className="px-6 lg:px-[60px] flex items-center justify-between mt-4">
          <span className="text-[11px] tracking-[0.15em] text-white/50">
            {String(galleryIndex + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={prevGalleryImage}
              className="text-[11px] tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={nextGalleryImage}
              className="text-[11px] tracking-[0.2em] uppercase opacity-40 hover:opacity-100 transition-opacity"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Section 04 - Sustainability */}
      <section className="px-6 lg:px-[60px] py-16 relative">
        <div className="absolute left-[45px] top-0 bottom-0 w-px bg-white/10 hidden lg:block" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="fade-in-section relative aspect-[4/3]">
            <Image
              src="https://ext.same-assets.com/3590549328/2539342009.jpeg"
              alt="Sustainability"
              fill
              className="object-cover"
            />
          </div>
          <div className="fade-in-section flex flex-col justify-center">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span className="text-[11px] tracking-[0.2em] text-white/50">04</span>
              <span className="text-[11px] tracking-[0.25em] uppercase text-white/50">Together for a Better Planet</span>
            </div>
            <h2 className="text-[clamp(1.2rem,2.5vw,1.6rem)] font-bold tracking-[-0.01em] leading-[1.3] uppercase mb-6">
              We are committed to limit our ecological footprint, and sustainability is at the very heart of our principles, considerations and actions.
            </h2>
            <p className="text-[11px] text-white/50 leading-relaxed uppercase tracking-[0.03em]">
              We are keen to imagine recommendations to optimize eco-score on the projects and films we work on. Therefore, our company is labeled Eco-Prod, and part of the first 12 companies in France to be awarded the Eco-Prod Pioneer award.
            </p>
            <div className="flex items-center gap-6 mt-8">
              {ecoLogos.map((logo, i) => (
                <div key={i} className="relative h-12 w-24">
                  <Image
                    src={logo}
                    alt="Eco certification"
                    fill
                    className="object-contain opacity-80"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wall of Frame - Client Logos */}
      <section className="px-6 lg:px-[60px] py-16 relative">
        <div className="absolute left-[45px] top-0 bottom-0 w-px bg-white/10 hidden lg:block" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
          <div>
            <h2 className="text-[clamp(4rem,12vw,10rem)] font-bold tracking-[-0.04em] leading-[0.9]">
              WALL OF
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-40">
                <path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4" />
              </svg>
              <span className="text-[11px] tracking-[0.2em] text-white/40">60fps</span>
            </div>
          </div>
        </div>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-6 border-t border-l border-white/10">
          {clientLogos.map((logo) => (
            <div key={logo.name} className="border-r border-b border-white/10 aspect-[3/2] flex items-center justify-center p-6 group">
              <Image
                src={logo.image}
                alt={logo.name}
                width={100}
                height={50}
                className="opacity-30 group-hover:opacity-100 transition-opacity duration-500 object-contain filter grayscale group-hover:grayscale-0"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8">
          <span className="text-[11px] tracking-[0.15em] text-white/30">(09)</span>
          <span className="text-[clamp(4rem,12vw,10rem)] font-bold tracking-[-0.04em]">F(R)AME</span>
        </div>

        <div className="flex justify-start mt-4">
          <span className="text-[11px] tracking-[0.1em] text-white/30">461px</span>
        </div>
      </section>

      {/* Get In Touch */}
      <section className="px-6 lg:px-[60px] py-12 border-t border-white/10">
        <Link href="/contact" className="block group">
          <h2 className="text-[clamp(3rem,12vw,10rem)] font-bold tracking-[-0.03em] uppercase transition-opacity duration-300 group-hover:opacity-50">
            GET IN TOUCH
          </h2>
        </Link>
      </section>
    </div>
  );
}
