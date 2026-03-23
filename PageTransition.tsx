'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const prevPathname = useRef(pathname);

  // Get page name from pathname for display
  const getPageName = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'HOME';
    return segments[segments.length - 1].toUpperCase().replace(/-/g, ' ');
  };

  useEffect(() => {
    // Skip transition on initial load
    if (prevPathname.current === pathname) {
      setDisplayChildren(children);
      return;
    }

    setIsTransitioning(true);
    prevPathname.current = pathname;

    const pageName = getPageName(pathname);

    // Exit animation
    const tl = gsap.timeline({
      onComplete: () => {
        setDisplayChildren(children);

        // Entry animation
        gsap.timeline()
          .to(progressRef.current, {
            scaleX: 1,
            duration: 0.3,
            ease: 'power2.out',
          })
          .to(textRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.2,
            ease: 'power2.in',
          }, '-=0.1')
          .to(overlayRef.current, {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 0.6,
            ease: 'power3.inOut',
          })
          .fromTo(containerRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            '-=0.4'
          )
          .add(() => {
            setIsTransitioning(false);
            // Reset progress bar
            gsap.set(progressRef.current, { scaleX: 0 });
          });
      }
    });

    // Reset progress bar
    gsap.set(progressRef.current, { scaleX: 0 });

    tl.to(containerRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.35,
      ease: 'power2.in',
    })
    .to(overlayRef.current, {
      scaleY: 1,
      transformOrigin: 'bottom',
      duration: 0.5,
      ease: 'power3.inOut',
    }, '-=0.15')
    .fromTo(textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
      '-=0.2'
    )
    .to(progressRef.current, {
      scaleX: 0.6,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.2');

  }, [pathname, children]);

  return (
    <>
      {/* Transition Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-black pointer-events-none flex items-center justify-center"
        style={{ transform: 'scaleY(0)', transformOrigin: 'bottom' }}
      >
        {/* Page name indicator */}
        <div ref={textRef} className="text-center" style={{ opacity: 0 }}>
          <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase block mb-2">
            Loading
          </span>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-[-0.02em] uppercase">
            {getPageName(pathname)}
          </h2>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <div
            ref={progressRef}
            className="h-full bg-white origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Corner decorations */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-2 h-2 bg-white" />
          <div className="w-2 h-2 bg-white" />
        </div>
        <div className="absolute bottom-8 right-8 flex items-center gap-2">
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/30">First Frame</span>
        </div>
      </div>

      {/* Content */}
      <div ref={containerRef}>
        {displayChildren}
      </div>
    </>
  );
}
