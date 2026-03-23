'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate progress
    const duration = 2500;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);

    // Logo animation
    if (logoRef.current) {
      const blocks = logoRef.current.querySelectorAll('rect');
      gsap.fromTo(
        blocks,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'back.out(1.7)',
        }
      );
    }

    // Text animation
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' }
      );
    }

    // Complete animation after progress finishes
    const completeTimer = setTimeout(() => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: onComplete,
        });
      }
    }, duration + 500);

    return () => clearTimeout(completeTimer);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center"
    >
      {/* Logo */}
      <div ref={logoRef} className="mb-12">
        <svg width="64" height="40" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="6" height="6" fill="white" />
          <rect x="8" width="6" height="6" fill="white" />
          <rect y="14" width="6" height="6" fill="white" />
          <rect x="8" y="14" width="6" height="6" fill="white" />
          <rect x="18" width="6" height="6" fill="white" />
          <rect x="26" width="4" height="6" fill="white" />
          <rect x="18" y="14" width="6" height="6" fill="white" />
        </svg>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-px bg-white/20 overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full bg-white transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading Text */}
      <div ref={textRef} className="mt-6 text-[11px] tracking-[0.3em] uppercase text-white/50">
        Loading
      </div>

      {/* Progress Percentage */}
      <div className="mt-2 text-[11px] tracking-[0.2em] font-light">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
