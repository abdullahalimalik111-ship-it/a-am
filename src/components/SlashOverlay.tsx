/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SlashOverlayProps {
  activeType: 'dismantle' | 'cleave' | 'fuga' | 'domain' | 'world_slash' | 'lightning' | 'heal' | null;
}

export const SlashOverlay: React.FC<SlashOverlayProps> = ({ activeType }) => {
  if (!activeType) return null;

  if (activeType === 'fuga') {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden animate-pulse"
        aria-hidden="true"
      >
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

  if (activeType === 'world_slash') {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        {/* Spatial rift reality slice */}
        <div className="absolute w-full h-1 bg-white shadow-[0_0_30px_#a855f7,0_0_60px_#ec4899] transform -rotate-12 scale-x-125" />
        <div className="relative text-center">
          <span className="font-cinzel text-4xl md:text-6xl font-black text-purple-200 tracking-widest drop-shadow-[0_0_50px_rgba(168,85,247,1)]">
            世界を断つ斬撃
          </span>
          <p className="text-purple-300 font-mono tracking-widest text-sm uppercase mt-2">
            World Cutting Slash • Space & Existence Severed
          </p>
        </div>
      </div>
    );
  }

  if (activeType === 'lightning') {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-cyan-500/25 mix-blend-color-dodge animate-pulse" />
        <span className="font-cinzel text-4xl md:text-6xl font-black text-cyan-200 tracking-widest drop-shadow-[0_0_40px_rgba(6,182,212,1)]">
          神武解 • KAMUTOKE
        </span>
      </div>
    );
  }

  if (activeType === 'heal') {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-emerald-500/20 mix-blend-screen animate-pulse" />
        <span className="font-cinzel text-3xl md:text-5xl font-black text-emerald-200 tracking-widest drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]">
          反転術式 • REVERSE CURSED RESTORATION
        </span>
      </div>
    );
  }

  // Dismantle, Cleave, or standard slashes
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
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
