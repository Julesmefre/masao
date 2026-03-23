'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  audioElement?: HTMLAudioElement | null;
  isPlaying: boolean;
  mode?: 'waveform' | 'spectrum' | 'bars';
  color?: string;
  barCount?: number;
  height?: number;
  className?: string;
}

export default function AudioVisualizer({
  audioElement,
  isPlaying,
  mode = 'bars',
  color = '#ffffff',
  barCount = 32,
  height = 60,
  className = '',
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio context and analyzer
  useEffect(() => {
    if (!audioElement || isInitialized) return;

    try {
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      audioContextRef.current = new AudioContextClass();

      // Create analyzer
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      // Connect audio element to analyzer
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      setIsInitialized(true);
    } catch (error) {
      console.log('Audio visualization not supported');
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioElement, isInitialized]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;

    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isPlaying) {
        // Draw idle state
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `${color}20`;
        const barWidth = canvas.width / barCount;
        for (let i = 0; i < barCount; i++) {
          const x = i * barWidth;
          const barHeight = 2;
          ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth - 2, barHeight);
        }
        return;
      }

      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mode === 'bars') {
        const barWidth = canvas.width / barCount;
        const step = Math.floor(bufferLength / barCount);

        for (let i = 0; i < barCount; i++) {
          const value = dataArray[i * step];
          const percent = value / 255;
          const barHeight = Math.max(2, percent * canvas.height * 0.9);

          const x = i * barWidth;
          const y = (canvas.height - barHeight) / 2;

          // Gradient effect
          const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
          gradient.addColorStop(0, `${color}40`);
          gradient.addColorStop(0.5, color);
          gradient.addColorStop(1, `${color}40`);

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth - 2, barHeight);
        }
      } else if (mode === 'waveform') {
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      } else if (mode === 'spectrum') {
        const barWidth = canvas.width / bufferLength;

        for (let i = 0; i < bufferLength; i++) {
          const value = dataArray[i];
          const percent = value / 255;
          const barHeight = percent * canvas.height;

          // Color based on frequency
          const hue = (i / bufferLength) * 60; // Yellow to red range
          ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${percent})`;

          ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
        }
      }
    };

    if (isPlaying) {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      draw();
    } else {
      draw(); // Draw idle state
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, mode, color, barCount]);

  // Fallback visualization when no audio context
  if (!isInitialized) {
    return (
      <div className={`flex items-center gap-1 ${className}`} style={{ height }}>
        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className="bg-white/30 transition-all duration-150"
            style={{
              width: `${100 / barCount - 1}%`,
              height: isPlaying ? `${Math.random() * 80 + 20}%` : '10%',
              animationDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={height}
      className={className}
      style={{ width: '100%', height }}
    />
  );
}

// Simulated visualizer for demo (no real audio)
export function SimulatedVisualizer({
  isPlaying,
  barCount = 24,
  height = 40,
  className = '',
}: {
  isPlaying: boolean;
  barCount?: number;
  height?: number;
  className?: string;
}) {
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(10));

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(barCount).fill(10));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev =>
        prev.map(() => Math.random() * 80 + 20)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div
      className={`flex items-end justify-center gap-[2px] ${className}`}
      style={{ height }}
    >
      {bars.map((height, i) => (
        <div
          key={i}
          className="bg-gradient-to-t from-white/30 to-white transition-all duration-100 ease-out"
          style={{
            width: `${100 / barCount - 0.5}%`,
            height: `${height}%`,
            minHeight: 2,
          }}
        />
      ))}
    </div>
  );
}
