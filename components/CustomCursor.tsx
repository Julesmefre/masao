'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'play' | 'view'>('default');
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  const updateCursorPosition = useCallback(() => {
    // Higher lerp factor (0.35) for faster, more fluid movement
    const lerp = 0.35;

    positionRef.current.x += (targetRef.current.x - positionRef.current.x) * lerp;
    positionRef.current.y += (targetRef.current.y - positionRef.current.y) * lerp;

    // Update DOM elements directly for better performance
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px) translate(-50%, -50%)`;
    }
    if (horizontalRef.current) {
      horizontalRef.current.style.transform = `translateY(${positionRef.current.y}px)`;
    }
    if (verticalRef.current) {
      verticalRef.current.style.transform = `translateX(${positionRef.current.x}px)`;
    }

    rafRef.current = requestAnimationFrame(updateCursorPosition);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateCursorPosition);

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isPlayElement =
        target.closest('.play-trigger') ||
        target.closest('video') ||
        target.closest('.video-container') ||
        target.classList.contains('play-trigger');

      const isViewElement =
        target.closest('.view-trigger') ||
        target.closest('.production-card');

      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button';

      if (isPlayElement) {
        setCursorState('play');
      } else if (isViewElement) {
        setCursorState('view');
      } else if (isClickable) {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleElementHover, { passive: true });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, [updateCursorPosition]);

  // Animate cursor state changes
  useEffect(() => {
    if (cursorRef.current && textRef.current) {
      if (cursorState === 'play' || cursorState === 'view') {
        gsap.to(cursorRef.current, {
          width: 80,
          height: 80,
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(textRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
        });
        // Hide crosshairs on play/view
        gsap.to([horizontalRef.current, verticalRef.current], {
          opacity: 0,
          duration: 0.15,
        });
      } else if (cursorState === 'hover') {
        gsap.to(cursorRef.current, {
          width: 50,
          height: 50,
          duration: 0.25,
          ease: 'power2.out',
        });
        gsap.to(textRef.current, {
          opacity: 0,
          scale: 0.5,
          duration: 0.15,
        });
        gsap.to([horizontalRef.current, verticalRef.current], {
          opacity: 0.06,
          duration: 0.15,
        });
      } else {
        gsap.to(cursorRef.current, {
          width: 10,
          height: 10,
          duration: 0.25,
          ease: 'power2.out',
        });
        gsap.to(textRef.current, {
          opacity: 0,
          scale: 0.5,
          duration: 0.15,
        });
        gsap.to([horizontalRef.current, verticalRef.current], {
          opacity: 0.15,
          duration: 0.15,
        });
      }
    }
  }, [cursorState]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <div style={{ display: isVisible ? 'block' : 'none' }}>
      {/* Full-viewport Horizontal Line */}
      <div
        ref={horizontalRef}
        className="fixed left-0 w-screen h-px bg-white pointer-events-none z-[99997]"
        style={{
          top: 0,
          opacity: 0.15,
          willChange: 'transform',
        }}
      />

      {/* Full-viewport Vertical Line */}
      <div
        ref={verticalRef}
        className="fixed top-0 h-screen w-px bg-white pointer-events-none z-[99997]"
        style={{
          left: 0,
          opacity: 0.15,
          willChange: 'transform',
        }}
      />

      {/* Main Cursor Circle */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center rounded-full border border-white/40 backdrop-blur-sm"
        style={{
          width: 10,
          height: 10,
          backgroundColor: cursorState === 'default' ? 'white' : 'rgba(0,0,0,0.3)',
          willChange: 'transform, width, height',
        }}
      >
        <span
          ref={textRef}
          className="text-[10px] tracking-[0.15em] uppercase font-medium text-white whitespace-nowrap"
          style={{ opacity: 0, transform: 'scale(0.5)' }}
        >
          {cursorState === 'play' ? 'PLAY' : cursorState === 'view' ? 'VIEW' : ''}
        </span>
      </div>
    </div>
  );
}
