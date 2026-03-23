'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import type { Production, Track } from '@/lib/data';
import { SimulatedVisualizer } from '@/components/AudioVisualizer';

// Free sample audio URLs for demo
const SAMPLE_AUDIO_URLS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
];

interface MusicDetailProps {
  production: Production;
  nextProduction?: Production;
}

export default function MusicDetail({ production, nextProduction }: MusicDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const cdRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const tracks = production.tracks || [
    { number: '01', title: 'GOLDEN HEART', duration: '3:33' },
    { number: '02', title: 'THE TEAM', duration: '1:50' },
    { number: '03', title: 'LOCK DOWN SYNDROM', duration: '1:59' },
    { number: '04', title: 'TRAINING DAY', duration: '1:51' },
    { number: '05', title: 'BACK TO BUSINESS', duration: '2:26' },
    { number: '06', title: 'OUR DNA', duration: '2:08' },
  ];

  const currentTrack = tracks[currentTrackIndex];

  // Parse duration string to seconds
  const parseDuration = (dur: string) => {
    const parts = dur.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // CD spin animation
  useEffect(() => {
    if (cdRef.current) {
      if (isPlaying) {
        gsap.to(cdRef.current, {
          rotation: '+=360',
          duration: 3,
          ease: 'none',
          repeat: -1,
        });
      } else {
        gsap.killTweensOf(cdRef.current);
      }
    }
  }, [isPlaying]);

  // Simulate audio progress
  useEffect(() => {
    if (!isPlaying) return;

    const trackDuration = parseDuration(currentTrack.duration);
    setDuration(trackDuration);

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= trackDuration) {
          // Go to next track
          if (currentTrackIndex < tracks.length - 1) {
            setCurrentTrackIndex(prev => prev + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 0;
          }
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex, currentTrack.duration, tracks.length]);

  // Entry animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo('.cd-container',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
    );

    tl.fromTo('.track-item',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.03, ease: 'power2.out' },
      '-=0.8'
    );

    tl.fromTo('.player-controls',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );
  }, []);

  // Light reflection animation
  useEffect(() => {
    const lightElement = document.querySelector('.cd-light-detail');
    if (lightElement) {
      gsap.to(lightElement, {
        rotation: 360,
        duration: 10,
        ease: 'none',
        repeat: -1,
      });
    }
  }, []);

  const handleTrackClick = (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(percent * duration);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={production.thumbnail}
          alt={production.title}
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      </div>

      {/* Back Button */}
      <div className="absolute top-24 left-6 lg:left-[100px] z-20">
        <Link
          href="/productions/music"
          className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase opacity-60 hover:opacity-100 transition-opacity"
        >
          <div className="w-px h-4 bg-white" />
          <span>Back</span>
        </Link>
      </div>

      {/* Next Project Preview */}
      {nextProduction && (
        <Link
          href={`/production/${nextProduction.slug}?category=music`}
          className="absolute top-24 right-6 lg:right-[100px] z-20 flex items-center gap-4 group"
        >
          <span className="text-[11px] tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">
            Next project
          </span>
          <div className="relative w-20 h-14 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
            <Image
              src={nextProduction.thumbnail}
              alt={nextProduction.title}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center px-6 lg:px-[100px] py-24">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Track List - Left Side */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[11px] tracking-[0.15em] text-white/50">
                {String(currentTrackIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[11px] tracking-[0.15em] text-white/30">/</span>
              <span className="text-[11px] tracking-[0.15em] text-white/50">
                {String(tracks.length).padStart(2, '0')}
              </span>
            </div>

            <div className="space-y-0 max-h-[50vh] overflow-y-auto hide-scrollbar">
              {tracks.map((track, index) => (
                <button
                  key={track.number}
                  type="button"
                  onClick={() => handleTrackClick(index)}
                  className={`track-item w-full flex items-center justify-between py-2 border-b border-white/5 transition-all ${
                    currentTrackIndex === index
                      ? 'text-white'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <span className="text-[11px] tracking-wide uppercase truncate pr-4">
                    {track.title}
                  </span>
                  <span className="text-[10px] tracking-wider text-white/30 flex-shrink-0">
                    {track.duration}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CD Player - Center */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex items-center justify-center">
            <div className="cd-container relative w-[60vw] h-[60vw] max-w-[500px] max-h-[500px]">
              {/* CD Case */}
              <div className="absolute inset-0 flex">
                {/* Hinge */}
                <div className="w-[10%] h-full bg-gradient-to-r from-[#2a2a2a] via-[#1a1a1a] to-[#111] relative">
                  <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-2 h-[70%] bg-gradient-to-r from-[#444] via-[#333] to-[#222] rounded-full" />
                </div>

                {/* CD Holder */}
                <div className="flex-1 h-full bg-gradient-to-br from-[#151515] via-[#0a0a0a] to-[#050505] relative overflow-hidden rounded-r-sm">
                  {/* CD Disc */}
                  <div
                    ref={cdRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full"
                  >
                    {/* Base */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1f1f2f] via-[#151520] to-[#0a0a12] shadow-2xl" />

                    {/* Artwork */}
                    <div className="absolute inset-[10%] rounded-full overflow-hidden">
                      <Image
                        src={production.thumbnail}
                        alt={production.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/30" />
                    </div>

                    {/* Grooves */}
                    <div className="absolute inset-[6%] rounded-full border border-white/[0.02]" />
                    <div className="absolute inset-[25%] rounded-full border border-white/[0.04]" />
                    <div className="absolute inset-[40%] rounded-full border border-white/[0.02]" />

                    {/* Center hole */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10%] aspect-square rounded-full bg-[#0a0a0a] border-2 border-[#1a1a1a]" />

                    {/* Light reflection */}
                    <div className="cd-light-detail absolute inset-0 rounded-full">
                      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_45deg,transparent_0deg,rgba(255,120,120,0.06)_20deg,rgba(255,220,120,0.06)_40deg,rgba(120,255,120,0.06)_60deg,rgba(120,220,255,0.06)_80deg,rgba(180,120,255,0.06)_100deg,transparent_120deg,transparent_180deg,rgba(255,120,120,0.06)_200deg,rgba(255,220,120,0.06)_220deg,rgba(120,255,120,0.06)_240deg,rgba(120,220,255,0.06)_260deg,rgba(180,120,255,0.06)_280deg,transparent_300deg)]" />
                      <div className="absolute top-[8%] left-[15%] w-[50%] h-[3px] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-[-25deg] blur-[2px]" />
                    </div>

                    {/* Edge */}
                    <div className="absolute inset-0 rounded-full border border-white/5" />
                  </div>

                  {/* Case overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-black/10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-[#2a2a2a] to-transparent" />
                </div>
              </div>
            </div>
          </div>

          {/* Info - Right Side */}
          <div className="lg:col-span-3 order-3 flex flex-col justify-end">
            {/* Empty space for balance */}
          </div>
        </div>
      </div>

      {/* Player Controls - Bottom */}
      <div className="player-controls fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/95 to-transparent pt-8 pb-8 px-6 lg:px-[100px]">
        {/* Audio Visualizer */}
        <div className="mb-6">
          <SimulatedVisualizer isPlaying={isPlaying} barCount={48} height={50} className="w-full" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Play/Pause & Progress */}
          <div className="flex items-center gap-6 flex-1">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-3 group"
            >
              <div className={`w-12 h-12 rounded-full border border-white/30 flex items-center justify-center transition-all ${isPlaying ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                {isPlaying ? (
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-white rounded-full" />
                    <div className="w-1 h-4 bg-white rounded-full" />
                  </div>
                ) : (
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="white" className="ml-1">
                    <polygon points="0,0 14,8 0,16" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase opacity-50 group-hover:opacity-100 transition-opacity hidden lg:block">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
            </button>

            {/* Progress Bar */}
            <div className="flex-1 flex items-center gap-4">
              <span className="text-[11px] tracking-wider text-white/50 w-10">
                {formatTime(currentTime)}
              </span>
              <div
                ref={progressRef}
                className="flex-1 h-[2px] bg-white/20 cursor-pointer relative group"
                onClick={handleProgressClick}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-white transition-all"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
                />
              </div>
              <span className="text-[11px] tracking-wider text-white/50 w-10 text-right">
                {currentTrack.duration}
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase opacity-50 hover:opacity-100 transition-opacity"
            >
              <span>Sound</span>
              <span className={isMuted ? 'text-white/30' : 'text-white'}>
                {isMuted ? 'Off' : 'On'}
              </span>
            </button>
          </div>

          {/* Title & Credits */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase">
                {production.title}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] tracking-[0.15em] uppercase text-white/50">
                  {production.client}
                </span>
                <span className="text-[11px] tracking-[0.15em] text-white/30">
                  {production.director}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCredits(true)}
              className="text-[11px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity underline underline-offset-4"
            >
              Credits
            </button>
          </div>
        </div>
      </div>

      {/* To Top Button */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 left-6 lg:left-[100px] z-20 flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase opacity-30 hover:opacity-100 transition-opacity"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="rotate-[-90deg]">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        <span>To top</span>
      </button>

      {/* Credits Modal */}
      {showCredits && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
          onClick={() => setShowCredits(false)}
        >
          <div
            className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold tracking-tight uppercase">Credits</h2>
              <button
                type="button"
                onClick={() => setShowCredits(false)}
                className="w-8 h-8 flex items-center justify-center border border-white/20 hover:border-white/50 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-[12px]">
              <div className="flex justify-between">
                <span className="text-white/50">Project</span>
                <span>{production.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Client</span>
                <span>{production.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Category</span>
                <Link href="/productions/music" className="hover:opacity-70 transition-opacity">
                  Music
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Composer</span>
                <span>{production.director}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Year</span>
                <span>{production.year || '2024'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
