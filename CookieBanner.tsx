'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    if (!cookieChoice) {
      // Delay showing the banner for premium feel
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handlePreferences = () => {
    localStorage.setItem('cookieConsent', 'preferences');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-16 left-6 max-w-[340px] p-4 bg-black/95 border border-white/10 z-[10000] animate-slideUp backdrop-blur-sm"
    >
      <p className="text-[11px] leading-relaxed mb-5 text-white/70 tracking-wide">
        {t('cookie.message')}
      </p>
      <div className="flex gap-6">
        <button
          type="button"
          onClick={handleAccept}
          className="text-[11px] tracking-[0.15em] text-white hover:opacity-70 transition-opacity font-medium uppercase"
        >
          {t('cookie.accept')}
        </button>
        <button
          type="button"
          onClick={handlePreferences}
          className="text-[11px] tracking-[0.15em] text-white/40 hover:text-white/70 transition-colors uppercase"
        >
          {t('cookie.preferences')}
        </button>
      </div>
    </div>
  );
}
