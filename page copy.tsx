'use client';

import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const parisTime = now.toLocaleTimeString('en-US', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setTime(parisTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0d12]">
      {/* Hero */}
      <section className="px-6 py-24">
        <h1 className="text-[12vw] font-bold tracking-tighter leading-none">
          CONTACT
        </h1>
      </section>

      {/* Info */}
      <section className="px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10">
        <div>
          <span className="text-xs tracking-wider opacity-50 block mb-2">TIME ZONE</span>
          <p className="text-sm">PARIS</p>
          <p className="text-sm opacity-70">{time}</p>
        </div>
        <div>
          <span className="text-xs tracking-wider opacity-50 block mb-2">ADDRESS</span>
          <a
            href="https://g.co/kgs/koJpt8e"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:opacity-70 transition-opacity block"
          >
            <p>6 RUE JULES SIMON</p>
            <p>92100 BOULOGNE</p>
          </a>
        </div>
      </section>

      {/* Team */}
      <section className="px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10">
        {/* Axel */}
        <div className="text-center py-12 border border-white/10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">AXEL COVO</h2>
          <p className="text-xs tracking-wider opacity-50 mb-4">
            <span>Founder</span>
            <span className="mx-2">•</span>
            <span>Producer</span>
            <span className="mx-2">•</span>
            <span>Music Composer</span>
          </p>
          <a
            href="mailto:axel@firstframe.fr"
            className="text-sm hover:opacity-70 transition-opacity"
          >
            AXEL@FIRSTFRAME.FR
          </a>
        </div>

        {/* Rafael */}
        <div className="text-center py-12 border border-white/10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">RAFAEL COVO</h2>
          <p className="text-xs tracking-wider opacity-50 mb-4">
            <span>Founder</span>
            <span className="mx-2">•</span>
            <span>Producer</span>
            <span className="mx-2">•</span>
            <span>Director</span>
          </p>
          <a
            href="mailto:rafael@firstframe.fr"
            className="text-sm hover:opacity-70 transition-opacity"
          >
            RAFAEL@FIRSTFRAME.FR
          </a>
        </div>
      </section>

      {/* Additional contacts */}
      <section className="px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-center py-12 border border-white/10">
          <h3 className="text-xl font-bold tracking-tight mb-4">JOBS</h3>
          <a
            href="mailto:jobs@firstframe.fr"
            className="text-sm hover:opacity-70 transition-opacity"
          >
            JOBS@FIRSTFRAME.FR
          </a>
        </div>
        <div className="text-center py-12 border border-white/10">
          <h3 className="text-xl font-bold tracking-tight mb-4">SAY HELLO</h3>
          <a
            href="mailto:contact@firstframe.fr"
            className="text-sm hover:opacity-70 transition-opacity"
          >
            CONTACT@FIRSTFRAME.FR
          </a>
        </div>
      </section>

      {/* To Top */}
      <section className="px-6 py-8 border-t border-white/10">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-xs tracking-wider opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transform rotate-180"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span>TO TOP</span>
        </button>
      </section>
    </div>
  );
}
