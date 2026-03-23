'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import { heroSlides } from '@/lib/data';
import { useLanguage } from '@/lib/language-context';
import LoadingScreen from '@/components/LoadingScreen';
import VideoModal from '@/components/VideoModal';
import { SoundToggleInline, useSound } from '@/components/SoundToggle';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [hoveredIndicator, setHoveredIndicator] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const studioInfoRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const { t } = useLanguage();
  const { isMuted } = useSound();

  const slide = heroSlides[currentSlide];

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Sync video muted state with global sound state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, currentSlide]);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  // Animation functions
  const animateSlideIn = useCallback(() => {
    const tl = gsap.timeline();

    if (counterRef.current) {
      tl.fromTo(counterRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0);
    }
    if (studioInfoRef.current) {
      tl.fromTo(studioInfoRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1);
    }
    if (titleRef.current) {
      tl.fromTo(titleRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.2);
    }
    if (metaRef.current) {
      tl.fromTo(metaRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.4);
    }
    if (playRef.current) {
      tl.fromTo(playRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 0.5);
    }
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 0.5);
    }
    if (prevRef.current && nextRef.current) {
      tl.fromTo([prevRef.current, nextRef.current], { opacity: 0 }, { opacity: 0.5, duration: 0.6, ease: 'power2.out' }, 0.6);
    }
    if (indicatorsRef.current) {
      tl.fromTo(indicatorsRef.current.children, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)' }, 0.7);
    }
  }, []);

  const animateSlideOut = useCallback(() => {
    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });
      if (titleRef.current) tl.to(titleRef.current, { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' }, 0);
      if (metaRef.current) tl.to(metaRef.current, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 0.1);
      if (ctaRef.current) tl.to(ctaRef.current, { opacity: 0, x: 20, duration: 0.4, ease: 'power2.in' }, 0.1);
    });
  }, []);

  const animateSlideTransition = useCallback(() => {
    const tl = gsap.timeline();
    if (titleRef.current) tl.fromTo(titleRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.2);
    if (metaRef.current) tl.fromTo(metaRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.4);
    if (ctaRef.current) tl.fromTo(ctaRef.current, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 0.5);
    if (counterRef.current) {
      const counterNumber = counterRef.current.querySelector('.counter-number');
      if (counterNumber) tl.fromTo(counterNumber, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.1);
    }
  }, []);

  const goToPrev = useCallback(async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setVideoLoaded(false);
    await animateSlideOut();
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => {
      animateSlideTransition();
      setIsTransitioning(false);
    }, 100);
  }, [isTransitioning, animateSlideOut, animateSlideTransition]);

  const goToNext = useCallback(async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setVideoLoaded(false);
    await animateSlideOut();
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => {
      animateSlideTransition();
      setIsTransitioning(false);
    }, 100);
  }, [isTransitioning, animateSlideOut, animateSlideTransition]);

  const goToSlide = useCallback(async (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setVideoLoaded(false);
    await animateSlideOut();
    setCurrentSlide(index);
    setTimeout(() => {
      animateSlideTransition();
      setIsTransitioning(false);
    }, 100);
  }, [isTransitioning, currentSlide, animateSlideOut, animateSlideTransition]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();
  };

  // Keyboard navigation
  useEffect(() => {
    if (isLoading) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (videoModalOpen) return;
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext, videoModalOpen, isLoading]);

  // Ken Burns animation
  useEffect(() => {
    if (mediaRef.current && isLoaded) {
      const media = mediaRef.current.querySelector('video, img');
      if (media) {
        gsap.set(media, { scale: 1, x: 0, y: 0 });
        gsap.to(media, { scale: 1.08, x: '-2%', y: '-1%', duration: 12, ease: 'none' });
      }
    }
  }, [currentSlide, isLoaded, videoLoaded]);

  // Initial load animation
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
        animateSlideIn();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, animateSlideIn]);

  // Auto-advance slides
  useEffect(() => {
    if (isLoading || videoModalOpen) return;
    const timer = setInterval(() => {
      if (!isTransitioning) goToNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [isTransitioning, goToNext, isLoading, videoModalOpen]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl={slide.videoUrl}
        thumbnail={slide.thumbnail}
        title={slide.title}
      />

      <div
        ref={containerRef}
        className="h-screen w-full bg-black overflow-hidden relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Background Media */}
        <div ref={mediaRef} className="absolute inset-0 overflow-hidden play-trigger video-container">
          <img
            src={slide.thumbnail}
            alt={slide.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
            style={{ willChange: 'transform' }}
          />
          {slide.videoUrl && (
            <video
              ref={videoRef}
              key={slide.id}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ willChange: 'transform' }}
            >
              <source src={slide.videoUrl} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        {/* Vertical Line */}
        <div className="absolute left-[90px] top-[80px] bottom-[80px] w-px bg-white/15 hidden lg:block" />

        {/* Counter */}
        <div ref={counterRef} className="absolute top-24 left-6 lg:left-[100px] z-10 flex items-start gap-4">
          <div className="w-px h-6 bg-white opacity-50" />
          <div className="counter-number font-light text-sm tracking-[0.2em]">
            {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
          </div>
        </div>

        {/* Studio Info */}
        <div ref={studioInfoRef} className="absolute top-24 right-6 lg:right-[100px] z-10 text-right hidden md:block">
          <p className="text-[11px] tracking-[0.25em] uppercase text-white/60 font-light">{t('home.creative_production')}</p>
          <p className="text-[11px] tracking-[0.25em] uppercase text-white/60 font-light">{t('home.post_production')}</p>
          <div className="flex items-center justify-end gap-3 mt-4">
            <span className="flex gap-1">
              <span className="w-[6px] h-[6px] bg-white" />
              <span className="w-[6px] h-[6px] bg-white" />
              <span className="w-[6px] h-[6px] bg-white" />
            </span>
            <span className="text-[11px] tracking-[0.25em] uppercase text-white/60 font-light">{t('home.fueled')}</span>
          </div>
        </div>

        {/* Title & Meta */}
        <div className="absolute bottom-[220px] lg:bottom-[240px] left-6 lg:left-[100px] z-10 max-w-3xl">
          <h1 ref={titleRef} className="text-[clamp(2.5rem,9vw,6rem)] font-bold tracking-[-0.03em] leading-[0.9] uppercase mb-4">
            {slide.title}
          </h1>
          <div ref={metaRef} className="flex items-center gap-4 flex-wrap">
            <span className="px-3 py-1.5 border border-white/40 text-[11px] tracking-[0.15em] uppercase font-medium">{slide.client}</span>
            <span className="text-sm text-white/60 tracking-wider">{slide.year}</span>
          </div>
        </div>

        {/* Discover CTA */}
        <div ref={ctaRef} className="absolute bottom-[220px] lg:bottom-[240px] right-6 lg:right-[100px] z-10 hidden md:flex items-center gap-4">
          <Link href={`/production/${slide.title.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-4 group">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="transform group-hover:translate-x-1 transition-transform duration-300">
              <path d="M8 20H32M32 20L22 10M32 20L22 30" stroke="white" strokeWidth="1" />
            </svg>
            <span className="text-[11px] tracking-[0.25em] uppercase font-light group-hover:opacity-70 transition-opacity">{t('home.discover')}</span>
          </Link>
        </div>

        {/* Play Button */}
        <div ref={playRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 play-trigger">
          <button
            type="button"
            onClick={() => setVideoModalOpen(true)}
            className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-500 group"
          >
            <svg width="20" height="24" viewBox="0 0 20 24" fill="white" className="ml-1 group-hover:scale-110 transition-transform duration-300">
              <polygon points="0,0 20,12 0,24" />
            </svg>
          </button>
        </div>

        {/* PREV Button */}
        <button
          ref={prevRef}
          type="button"
          className="absolute bottom-8 left-6 lg:left-[100px] z-10 flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase font-light hover:opacity-100 transition-all duration-300 group"
          onClick={goToPrev}
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">PREV</span>
        </button>

        {/* Slide Indicators with Thumbnail Preview */}
        <div ref={indicatorsRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-6">
          {heroSlides.map((slideItem, index) => (
            <div key={`indicator-${slideItem.id}`} className="relative group">
              {/* Thumbnail Preview */}
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-32 aspect-video overflow-hidden transition-all duration-300 pointer-events-none ${
                  hoveredIndicator === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <img src={slideItem.thumbnail} alt={slideItem.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="absolute bottom-2 left-2 right-2 text-[9px] tracking-wider uppercase truncate">{slideItem.title}</p>
              </div>

              {/* Indicator Square */}
              <button
                type="button"
                onClick={() => goToSlide(index)}
                onMouseEnter={() => setHoveredIndicator(index)}
                onMouseLeave={() => setHoveredIndicator(null)}
                className={`w-[8px] h-[8px] transition-all duration-500 ${
                  currentSlide === index ? 'bg-white' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* NEXT Button */}
        <button
          ref={nextRef}
          type="button"
          className="absolute bottom-8 right-6 lg:right-[100px] z-10 flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase font-light hover:opacity-100 transition-all duration-300 group"
          onClick={goToNext}
        >
          <span className="group-hover:translate-x-1 transition-transform duration-300">NEXT</span>
        </button>

        {/* Keyboard hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-8 z-10 text-[9px] tracking-[0.2em] uppercase text-white/20 hidden lg:block">
          ← → to navigate
        </div>

        {/* Sound Toggle */}
        <div className="absolute bottom-[160px] lg:bottom-[180px] right-6 lg:right-[100px] z-10">
          <SoundToggleInline />
        </div>
      </div>
    </>
  );
}
