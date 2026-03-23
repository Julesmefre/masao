'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Lenis from 'lenis';

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.page-title',
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out', delay: 0.3 }
      );

      gsap.fromTo('.contact-content',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.6, stagger: 0.1 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black pt-32 pb-20">
      <div className="px-6 lg:px-[100px]">
        <h1 className="page-title text-[clamp(3rem,12vw,10rem)] font-bold tracking-[-0.04em] leading-[0.85] uppercase mb-20">
          Let's Work
          <br />
          Together
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="contact-content">
            <div className="mb-12">
              <h2 className="text-[11px] tracking-[0.25em] uppercase text-white/40 mb-6">General Inquiries</h2>
              <a
                href="mailto:hello@firstframe.fr"
                className="text-[clamp(1.2rem,3vw,2rem)] font-bold tracking-[-0.01em] hover:opacity-60 transition-opacity"
              >
                hello@firstframe.fr
              </a>
            </div>

            <div className="mb-12">
              <h2 className="text-[11px] tracking-[0.25em] uppercase text-white/40 mb-6">New Business</h2>
              <a
                href="mailto:production@firstframe.fr"
                className="text-[clamp(1.2rem,3vw,2rem)] font-bold tracking-[-0.01em] hover:opacity-60 transition-opacity"
              >
                production@firstframe.fr
              </a>
            </div>

            <div className="mb-12">
              <h2 className="text-[11px] tracking-[0.25em] uppercase text-white/40 mb-6">Phone</h2>
              <a
                href="tel:+33142360530"
                className="text-[clamp(1.2rem,3vw,2rem)] font-bold tracking-[-0.01em] hover:opacity-60 transition-opacity"
              >
                +33 1 42 36 05 30
              </a>
            </div>
          </div>

          <div className="contact-content">
            <div className="mb-12">
              <h2 className="text-[11px] tracking-[0.25em] uppercase text-white/40 mb-6">Paris Office</h2>
              <address className="text-[14px] leading-relaxed not-italic text-white/70 tracking-[0.02em]">
                39 rue des Blancs Manteaux
                <br />
                75004 Paris
                <br />
                France
              </address>
            </div>

            <div className="mb-12">
              <h2 className="text-[11px] tracking-[0.25em] uppercase text-white/40 mb-6">Follow Us</h2>
              <div className="flex flex-col gap-4">
                <a
                  href="https://www.instagram.com/firstframe.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] tracking-[0.05em] text-white/70 hover:text-white transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/firstframe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] tracking-[0.05em] text-white/70 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://vimeo.com/firstframe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] tracking-[0.05em] text-white/70 hover:text-white transition-colors"
                >
                  Vimeo
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-content mt-20 pt-20 border-t border-white/10">
          <p className="text-[12px] leading-relaxed text-white/50 uppercase tracking-[0.05em] max-w-3xl">
            Whether you're looking to create compelling brand content, produce a documentary,
            or need post-production services, we're here to bring your vision to life.
            Get in touch and let's start a conversation.
          </p>
        </div>
      </div>
    </div>
  );
}
