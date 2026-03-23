'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  parallax?: boolean;
  parallaxSpeed?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  parallax = false,
  parallaxSpeed = 0.4,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Initial state
    gsap.set(container, {
      clipPath: 'inset(100% 0% 0% 0%)',
    });
    gsap.set(content, {
      scale: 1.2,
      y: 50,
    });

    // Create reveal animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(container, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.2,
      ease: 'power3.inOut',
      delay,
    })
    .to(content, {
      scale: 1,
      y: 0,
      duration: 1.4,
      ease: 'power3.out',
    }, '<');

    // Parallax effect
    if (parallax) {
      gsap.to(content, {
        yPercent: -20 * parallaxSpeed,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [delay, parallax, parallaxSpeed]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={contentRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
}

// Staggered text reveal component
interface StaggerTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function StaggerText({ children, className = '', delay = 0 }: StaggerTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    gsap.set(element, {
      opacity: 0,
      y: 20,
    });

    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [delay]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
