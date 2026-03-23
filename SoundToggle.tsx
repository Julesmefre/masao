'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';

// Sound context for global sound state
interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(true); // Start muted by default

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const setMuted = (muted: boolean) => {
    setIsMuted(muted);
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, setMuted }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}

// Sound Toggle Button Component
interface SoundToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SoundToggle({ className = '', size = 'md' }: SoundToggleProps) {
  const { isMuted, toggleMute } = useSound();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <button
      type="button"
      onClick={toggleMute}
      className={`${sizeClasses[size]} rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-300 ${className}`}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? (
        // Muted icon
        <svg
          width={iconSizes[size]}
          height={iconSizes[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Sound on icon
        <svg
          width={iconSizes[size]}
          height={iconSizes[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}

// Inline sound toggle for video overlays
export function SoundToggleInline({ className = '' }: { className?: string }) {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleMute();
      }}
      className={`flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase opacity-60 hover:opacity-100 transition-opacity ${className}`}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
      <span>{isMuted ? 'SOUND OFF' : 'SOUND ON'}</span>
    </button>
  );
}
