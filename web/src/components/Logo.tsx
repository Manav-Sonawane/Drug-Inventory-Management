'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
}

export default function Logo({
  size = 'md',
  showSubtitle = true,
  subtitle = 'Supply Chain Control',
  className = '',
}: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900 p-1 shadow-sm border border-blue-400/30`}
      >
        {/* MediSetu Bridge + Medical Cross Vector Graphic */}
        <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none">
          {/* Medical Cross base with gradient */}
          <path
            d="M38 12 H62 V38 H88 V62 H62 V88 H38 V62 H12 V38 H38 Z"
            fill="url(#logo-grad-1)"
            opacity="0.95"
          />
          {/* Arch Bridge cutout curve */}
          <path
            d="M20 70 Q 50 15 80 70 C 72 65 60 48 50 48 C 40 48 28 65 20 70 Z"
            fill="#38bdf8"
          />
          {/* River / Road S-curve pathway */}
          <path
            d="M50 48 Q 42 60 52 72 Q 58 78 48 88"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <defs>
            <linearGradient id="logo-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#00236f" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col justify-center">
        <h1 className={`${titleSizes[size]} text-[#00236f] tracking-tight leading-tight flex items-center gap-1 font-semibold`}>
          MediSetu
        </h1>
        {showSubtitle && (
          <p className="text-[11px] font-medium text-slate-500 tracking-wide leading-none">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
