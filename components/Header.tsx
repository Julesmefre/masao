'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '@/lib/language-context';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const menuFooterRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'ADVERTISEMENT', href: '/productions/commercial' },
    { label: 'ORIGINALS', href: '/productions/originals' },
    { label: 'CORPORATE', href: '/productions/corporate' },
    { label: 'MUSIC', href: '/productions/music' },
    { label: 'STUDIO', href: '/productions/studio' },
  ];

  const menuItems = [
    { label: 'Advertisement', href: '/productions/commercial' },
    { label: 'Originals', href: '/productions/originals' },
    { label: 'Corporate', href: '/productions/corporate' },
    { label: 'Music', href: '/productions/music' },
    { label: 'Studio', href: '/productions/studio' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  // Animate menu open/close
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';

      // Animate menu in
      if (menuRef.current) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
      }

      // Stagger animate menu links
      if (menuLinksRef.current) {
        const links = menuLinksRef.current.children;
        gsap.fromTo(
          links,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            delay: 0.2
          }
        );
      }

      // Animate footer
      if (menuFooterRef.current) {
        gsap.fromTo(
          menuFooterRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.6 }
        );
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => setMenuOpen(false)
      });
    }
  };

  const isHomepage = pathname === '/';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 ${isHomepage ? 'bg-transparent' : 'bg-black/90 backdrop-blur-sm'}`}>
        <nav className="flex items-center justify-between px-6 lg:px-[100px] py-6">
          {/* Logo */}
          <Link href="/" className="relative z-50">
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="6" height="6" fill="white" />
              <rect x="8" width="6" height="6" fill="white" />
              <rect y="14" width="6" height="6" fill="white" />
              <rect x="8" y="14" width="6" height="6" fill="white" />
              <rect x="18" width="6" height="6" fill="white" />
              <rect x="26" width="4" height="6" fill="white" />
              <rect x="18" y="14" width="6" height="6" fill="white" />
            </svg>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] tracking-[0.2em] font-light transition-opacity duration-300 hover:opacity-100 ${
                  pathname === link.href || pathname.startsWith(link.href) ? 'opacity-100' : 'opacity-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - About, Contact, Language, Menu */}
          <div className="flex items-center gap-8">
            {/* Desktop About & Contact */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                href="/about"
                className={`text-[11px] tracking-[0.2em] font-light transition-opacity duration-300 hover:opacity-100 ${
                  pathname === '/about' ? 'opacity-100' : 'opacity-50'
                }`}
              >
                ABOUT
              </Link>
              <Link
                href="/contact"
                className={`text-[11px] tracking-[0.2em] font-light transition-opacity duration-300 hover:opacity-100 ${
                  pathname === '/contact' ? 'opacity-100' : 'opacity-50'
                }`}
              >
                CONTACT
              </Link>
            </div>

            {/* Language Switcher */}
            <div className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.15em]">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`transition-opacity duration-300 hover:opacity-100 ${
                  language === 'en' ? 'opacity-100' : 'opacity-40'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={`transition-opacity duration-300 hover:opacity-100 ${
                  language === 'fr' ? 'opacity-100' : 'opacity-40'
                }`}
              >
                FR
              </button>
            </div>

            {/* Menu Button */}
            <button
              type="button"
              className="relative z-50 text-[11px] tracking-[0.2em] font-light opacity-100 hover:opacity-70 transition-opacity duration-300 lg:hidden"
              onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)}
            >
              {menuOpen ? 'CLOSE' : 'MENU'}
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen Menu Overlay */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 bg-black flex flex-col"
          style={{ opacity: 0 }}
        >
          {/* Menu Content */}
          <div className="flex-1 flex flex-col justify-center px-6 lg:px-[100px]">
            {/* Navigation Links */}
            <div ref={menuLinksRef} className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => closeMenu()}
                  className={`block text-[clamp(2rem,8vw,5rem)] font-bold tracking-[-0.02em] leading-[1.1] uppercase transition-opacity duration-300 hover:opacity-50 ${
                    pathname === item.href ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Menu Footer */}
          <div
            ref={menuFooterRef}
            className="px-6 lg:px-[100px] py-8 border-t border-white/10"
            style={{ opacity: 0 }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-4 text-[11px] tracking-[0.15em]">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`transition-opacity duration-300 ${
                    language === 'en' ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('fr')}
                  className={`transition-opacity duration-300 ${
                    language === 'fr' ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  FR
                </button>
              </div>

              {/* Links */}
              <div className="flex items-center gap-8 text-[11px] tracking-[0.15em] opacity-50">
                <Link href="/legals" onClick={() => closeMenu()} className="hover:opacity-100 transition-opacity">
                  Legals
                </Link>
                <a
                  href="https://beaucoup.studio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-100 transition-opacity"
                >
                  Credits
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
