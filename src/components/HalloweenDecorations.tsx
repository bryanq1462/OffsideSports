import React from 'react';

export const HalloweenDecorations: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none">
      {/* Top Left Spider Web */}
      <div className="absolute -top-2 -left-2 w-32 h-32 sm:w-48 sm:h-48 opacity-40">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400/60" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M0 0 L100 0" />
          <path d="M0 0 L0 100" />
          <path d="M0 0 L100 100" />
          <path d="M0 0 L100 50" />
          <path d="M0 0 L50 100" />
          <path d="M20 0 Q20 20 0 20" />
          <path d="M40 0 Q40 40 0 40" />
          <path d="M60 0 Q60 60 0 60" />
          <path d="M80 0 Q80 80 0 80" />
          <path d="M100 0 Q100 100 0 100" />
        </svg>
      </div>

      {/* Top Right Spider Web */}
      <div className="absolute -top-2 -right-2 w-32 h-32 sm:w-48 sm:h-48 opacity-40 transform scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-400/60" fill="none" stroke="currentColor" strokeWidth="0.8">
          <path d="M0 0 L100 0" />
          <path d="M0 0 L0 100" />
          <path d="M0 0 L100 100" />
          <path d="M0 0 L100 50" />
          <path d="M0 0 L50 100" />
          <path d="M20 0 Q20 20 0 20" />
          <path d="M40 0 Q40 40 0 40" />
          <path d="M60 0 Q60 60 0 60" />
          <path d="M80 0 Q80 80 0 80" />
          <path d="M100 0 Q100 100 0 100" />
        </svg>
      </div>

      {/* Ambient Radial Lights */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

      {/* Subtle Floating Silhouette Bats */}
      <div className="hidden md:block absolute top-24 left-16 opacity-30 animate-pulse">
        <span className="text-xl">🦇</span>
      </div>
      <div className="hidden md:block absolute top-36 right-20 opacity-30 animate-pulse delay-700">
        <span className="text-2xl">🦇</span>
      </div>
      <div className="hidden lg:block absolute top-1/2 left-8 opacity-25 animate-bounce">
        <span className="text-lg">👻</span>
      </div>
      <div className="hidden lg:block absolute top-2/3 right-10 opacity-25 animate-bounce delay-1000">
        <span className="text-xl">🎃</span>
      </div>
    </div>
  );
};
