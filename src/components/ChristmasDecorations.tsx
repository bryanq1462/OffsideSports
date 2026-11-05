import React, { useEffect, useState, useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
  size: number;
}

const FESTIVE_SYMBOLS = ['✨', '❄️', '⭐', '🎄', '🎁', '❅', '❆', '🔔'];
const FESTIVE_COLORS = ['#fbbf24', '#ffffff', '#ef4444', '#10b981', '#60a5fa', '#fde047'];

export const ChristmasDecorations: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [tiltOffset, setTiltOffset] = useState({ x: 0, y: 0 });

  // Mouse move interactive trail listener (fluid 60fps throttled)
  useEffect(() => {
    let lastTime = 0;
    let particleId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTime < 40) return;
      lastTime = now;

      const randomSymbol = FESTIVE_SYMBOLS[Math.floor(Math.random() * FESTIVE_SYMBOLS.length)];
      const randomColor = FESTIVE_COLORS[Math.floor(Math.random() * FESTIVE_COLORS.length)];
      const randomSize = Math.floor(Math.random() * 12) + 14;

      const newParticle: Particle = {
        id: ++particleId,
        x: e.clientX,
        y: e.clientY,
        symbol: randomSymbol,
        color: randomColor,
        size: randomSize
      };

      setParticles((prev) => [...prev.slice(-22), newParticle]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Mobile Gyroscope Device Orientation listener for parallax tilting effect
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const x = Math.max(-15, Math.min(15, e.gamma / 2));
        const y = Math.max(-15, Math.min(15, e.beta / 2));
        setTiltOffset({ x, y });
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // Cleanup aged sparkle particles
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => (prev.length > 0 ? prev.slice(1) : prev));
    }, 700);
    return () => clearTimeout(timer);
  }, [particles]);

  // Layered multi-depth falling snowflakes (45 distinct flakes)
  const snowflakes = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: `${(i * 2.22 + (i % 7) * 0.9).toFixed(1)}%`,
      size: `${(Math.random() * 0.9 + 0.45).toFixed(2)}rem`,
      duration: `${(Math.random() * 8 + 6).toFixed(1)}s`,
      delay: `${(Math.random() * 9).toFixed(1)}s`,
      opacity: (Math.random() * 0.55 + 0.25).toFixed(2),
      char: i % 4 === 0 ? '❄' : i % 4 === 1 ? '❅' : i % 4 === 2 ? '❆' : '•'
    }));
  }, []);

  return (
    <>
      {/* Interactive mouse sparkle trail */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle-particle select-none z-30 pointer-events-none"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            color: p.color,
            fontSize: `${p.size}px`,
            filter: `drop-shadow(0 0 10px ${p.color})`
          }}
        >
          {p.symbol}
        </div>
      ))}

      {/* Falling Snowflakes Atmosphere Layer with Gyroscope Parallax */}
      <div 
        className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none"
        style={{
          transform: `translate(${tiltOffset.x}px, ${tiltOffset.y}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute text-white select-none animate-snow pointer-events-none"
            style={{
              left: flake.left,
              fontSize: flake.size,
              animationDuration: flake.duration,
              animationDelay: flake.delay,
              opacity: flake.opacity,
              top: '-8vh',
              filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.9))'
            }}
          >
            {flake.char}
          </div>
        ))}
      </div>
    </>
  );
};
