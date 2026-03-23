'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import SoundToggle, { useSound } from './SoundToggle';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  thumbnail?: string;
  title: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, thumbnail, title }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { isMuted } = useSound();

  // Sync video muted state with global sound state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);

      // Animate in
      if (containerRef.current && contentRef.current) {
        gsap.set(containerRef.current, { opacity: 0 });
        gsap.set(contentRef.current, { scale: 0.9, opacity: 0 });

        const tl = gsap.timeline({
          onComplete: () => {
            setIsAnimating(false);
            if (videoRef.current) {
              videoRef.current.muted = isMuted;
              videoRef.current.play();
            }
          }
        });

        tl.to(containerRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        });

        tl.to(contentRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        }, '-=0.2');
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMuted]);

  const handleClose = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    videoRef.current?.pause();

    if (containerRef.current && contentRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          onClose();
        }
      });

      tl.to(contentRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });

      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, '-=0.1');
    }
  }, [isAnimating, onClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black/98 flex items-center justify-center"
      onClick={handleClose}
      style={{ opacity: 0 }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-8 right-8 z-10 w-12 h-12 flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors group"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="group-hover:rotate-90 transition-transform duration-300"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Sound toggle */}
      <div className="absolute top-8 right-24 z-10">
        <SoundToggle size="md" />
      </div>

      {/* Video container */}
      <div
        ref={contentRef}
        className="relative w-full max-w-6xl mx-8 aspect-video"
        onClick={(e) => e.stopPropagation()}
        style={{ opacity: 0, transform: 'scale(0.9)' }}
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            controls
            playsInline
            poster={thumbnail}
            muted={isMuted}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full bg-black/50 flex flex-col items-center justify-center border border-white/10">
            {thumbnail && (
              <img
                src={thumbnail}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
            )}
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border border-white/30 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/50 mb-2">Coming Soon</p>
              <p className="text-xl font-medium">{title}</p>
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="absolute bottom-8 left-8">
        <p className="text-[11px] tracking-[0.2em] uppercase text-white/50">{title}</p>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-8 right-8">
        <p className="text-[10px] tracking-[0.15em] uppercase text-white/30">ESC to close</p>
      </div>
    </div>
  );
}
