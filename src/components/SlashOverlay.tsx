/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SlashOverlayProps {
  activeType: 'dismantle' | 'cleave' | 'fuga' | 'domain' | null;
}

export const SlashOverlay: React.FC<SlashOverlayProps> = ({ activeType }) => {
  if (!activeType) return null;

  if (activeType === 'fuga') {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden animate-pulse"
        aria-hidden="true"
      >
        {/* Thermonuclear fire shockwave bloom */}
        <div className="absolute inset-0 bg-radial from-amber-500/40 via-red-600/30 to-black/80 mix-blend-screen transition-opacity duration-700" />
        <div className="relative text-center">
          <span className="font-cinzel text-5xl md:text-7xl font-black text-amber-200 tracking-widest drop-shadow-[0_0_40px_rgba(249,115,22,1)]">
            ■ 竈 - FUGA
          </span>
          <p className="text-red-300 font-mono tracking-widest text-sm uppercase mt-2">
            Incineration Protocol Active
          </p>
        </div>
      </div>
    );
  }

  // Dismantle, Cleave, or generic slashes
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Dynamic diagonal slashes cutting across the screen */}
        <line
          x1="-10%"
          y1="25%"
          x2="110%"
          y2="75%"
          stroke="url(#slashGrad1)"
          strokeWidth="3.5"
          className="drop-shadow-[0_0_12px_rgba(239,68,68,0.9)]"
        />
        <line
          x1="110%"
          y1="10%"
          x2="-10%"
          y2="90%"
          stroke="url(#slashGrad2)"
          strokeWidth="4"
          className="drop-shadow-[0_0_15px_rgba(220,38,38,1)]"
        />
        <line
          x1="15%"
          y1="-10%"
          x2="85%"
          y2="110%"
          stroke="url(#slashGrad1)"
          strokeWidth="2.5"
          className="drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]"
        />

        <defs>
          <linearGradient id="slashGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="45%" stopColor="#ef4444" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="55%" stopColor="#dc2626" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="slashGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="48%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="52%" stopColor="#ef4444" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
