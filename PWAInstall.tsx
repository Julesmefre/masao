'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration.scope);
          })
          .catch((error) => {
            console.log('SW registration failed:', error);
          });
      });
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);

      // Show install banner after 30 seconds
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowInstallBanner(true);
        }
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Install failed:', error);
    }

    setShowInstallBanner(false);
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (isInstalled || !showInstallBanner) return null;

  return (
    <div className="fixed bottom-20 left-6 right-6 lg:left-auto lg:right-6 lg:w-[360px] z-[9999] animate-slide-up">
      <div className="bg-[#111] border border-white/10 p-5 backdrop-blur-md">
        <div className="flex items-start gap-4">
          {/* App Icon */}
          <div className="w-12 h-12 bg-white/10 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white">
              <rect x="2" y="4" width="6" height="6" fill="currentColor" />
              <rect x="9" y="4" width="6" height="6" fill="currentColor" />
              <rect x="2" y="11" width="6" height="6" fill="currentColor" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-bold tracking-tight uppercase mb-1">
              Install First Frame
            </h3>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Add to your home screen for the best experience with offline access.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={handleInstall}
            className="flex-1 px-4 py-2.5 bg-white text-black text-[11px] tracking-[0.1em] uppercase font-medium hover:bg-white/90 transition-colors"
          >
            Install
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2.5 border border-white/20 text-[11px] tracking-[0.1em] uppercase hover:border-white/40 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
