import React from 'react';
import { Trophy, Flame, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface HeroProps {
  onSelectLeague: (league: string) => void;
  selectedLeague: string;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectLeague,
  selectedLeague,
  onExploreClick
}) => {
  const leagueBadges: { id: string; name: string; icon: string }[] = [
    { id: 'all', name: 'Todas las Camisetas', icon: '⚽' },
    { id: 'LaLiga', name: 'LaLiga EA Sports', icon: '🇪🇸' },
    { id: 'Premier League', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { id: 'Serie A', name: 'Serie A Enilive', icon: '🇮🇹' },
    { id: 'Selecciones', name: 'Selecciones Nacionales', icon: '🇨🇴' },
    { id: 'Liga BetPlay', name: 'Liga BetPlay', icon: '⚽' },
    { id: 'Clásicos Retro', name: 'Leyendas Retro', icon: '🏆' }
  ];

  return (
    <section className="relative bg-[#0a0a0a] text-white overflow-hidden border-b border-white/10 py-12 md:py-20">
      
      {/* Massive Background Watermark Typography */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <h1 className="text-[20rem] sm:text-[30rem] lg:text-[40rem] font-black italic tracking-tighter uppercase text-white whitespace-nowrap">
          KITS
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Tag */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
              <span className="text-[#ccff00]">NEW ARRIVAL / TEMPORADA 24-25</span>
            </div>

            {/* Main Bold Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">
              PASIÓN EN <br />
              <span className="text-[#ccff00] underline decoration-[#ccff00]/40 decoration-wavy">CADA PIEL</span>
            </h1>

            <p className="text-white/70 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
              Consigue las camisetas oficiales de tus equipos favoritos, selecciones nacionales y ediciones históricas retro. <strong className="text-[#ccff00] font-extrabold">Personaliza con tu nombre y dorsal oficial</strong> de cada liga.
            </p>

            {/* Value Props Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs font-black uppercase tracking-wider">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl text-white">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00] flex-shrink-0" />
                <span>Calidad AAAA Premium</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl text-white">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00] flex-shrink-0" />
                <span>Estampado Oficial</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl text-white">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00] flex-shrink-0" />
                <span>Garantía de Satisfacción</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-4">
              <button
                onClick={onExploreClick}
                className="bg-[#ccff00] hover:bg-white text-black font-black px-8 py-4 uppercase text-xs sm:text-sm tracking-widest skew-x-[-10deg] transition-all cursor-pointer shadow-xl flex items-center gap-3 group"
              >
                <div className="skew-x-[10deg] flex items-center gap-2">
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button
                onClick={() => onSelectLeague('Clásicos Retro')}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/20 font-black px-6 py-4 rounded-none text-xs sm:text-sm uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
              >
                <Trophy className="w-4 h-4 text-[#ccff00]" />
                <span>Colección Retro</span>
              </button>
            </div>

          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-[#121212] border border-white/10 p-6 rounded-3xl shadow-2xl overflow-hidden group">
              <div className="absolute top-4 right-4 bg-[#ccff00] text-black font-black text-[10px] uppercase px-3 py-1 rounded-sm z-10 tracking-widest">
                EDICIÓN DESTACADA
              </div>

              {/* Jersey Image Showcase */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-2xl bg-black flex items-center justify-center border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800"
                  alt="Real Madrid 2024/25"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <p className="text-[#ccff00] text-xs font-black uppercase tracking-widest">LaLiga EA Sports</p>
                  <h3 className="text-xl font-black italic uppercase text-white tracking-tight">Real Madrid Local 2024/25</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-amber-400 text-xs">★★★★★</span>
                    <span className="text-xs text-white/60 font-bold">(42 opiniones verificadas)</span>
                  </div>
                </div>
              </div>

              {/* Stamp feature teaser */}
              <div className="mt-4 p-3.5 bg-black rounded-xl border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ccff00]" />
                  <span className="text-white/80 font-bold">Estampado de Nombre & Dorsal</span>
                </div>
                <span className="text-[#ccff00] font-black uppercase text-[10px] bg-white/10 px-2.5 py-1 rounded border border-white/20">
                  +$10 USD
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Quick League Filter Bar */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-black mb-4 flex items-center gap-2">
            <span>SELECCIONA POR LIGA O TORNEO:</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {leagueBadges.map((badge) => {
              const isSelected = selectedLeague === badge.id;
              return (
                <button
                  key={badge.id}
                  onClick={() => onSelectLeague(badge.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ccff00] text-black shadow-lg shadow-[#ccff00]/20'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                  }`}
                >
                  <span className="text-sm">{badge.icon}</span>
                  <span>{badge.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

