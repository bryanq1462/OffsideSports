import React from 'react';
import { Trophy, ArrowRight, CheckCircle2, Sparkles, Edit3 } from 'lucide-react';
import { StoreSettings } from '../types';
import { handleImageError, normalizeImageSrc } from '../utils/imageUtils';

interface HeroProps {
  onSelectLeague: (league: string) => void;
  selectedLeague: string;
  onExploreClick: () => void;
  onExploreBalls?: () => void;
  settings?: StoreSettings;
  onOpenAdminToHero?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectLeague,
  selectedLeague,
  onExploreClick,
  onExploreBalls,
  settings,
  onOpenAdminToHero
}) => {
  const leagueBadges: { id: string; name: string; icon: string }[] = [
    { id: 'all', name: 'Todas', icon: '🏆' },
    { id: 'LaLiga', name: 'LaLiga', icon: '🇪🇸' },
    { id: 'Premier League', name: 'Premier League', icon: '🏴󠁧󠁢󠁥ⁿ󠁧󠁿' },
    { id: 'Serie A', name: 'Serie A', icon: '🇮🇹' },
    { id: 'Bundesliga', name: 'Bundesliga', icon: '🇩🇪' },
    { id: 'Ligue 1', name: 'Ligue 1', icon: '🇫🇷' },
    { id: 'MLS', name: 'MLS EE.UU.', icon: '🇺🇸' },
    { id: 'Saudi Pro League', name: 'Saudi Pro League', icon: '🇸🇦' },
    { id: 'Liga Argentina', name: 'Liga Argentina', icon: '🇦🇷' },
    { id: 'Brasileirão', name: 'Brasileirão', icon: '🇧🇷' },
    { id: 'Liga BetPlay', name: 'Liga BetPlay', icon: '🇨🇴' },
    { id: 'Selecciones', name: 'Selecciones', icon: '🌍' },
    { id: 'Clásicos Retro', name: 'Leyendas Retro', icon: '🏛️' }
  ];

  const isHalloween = settings?.themeMode === 'halloween';
  const featuredBadge = isHalloween ? '🎃 EDICIÓN DE MIEDO' : (settings?.featuredBadge || 'EDICIÓN DESTACADA');
  const featuredImage = normalizeImageSrc(settings?.featuredImage) || 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=800';
  const featuredLeague = settings?.featuredLeague || 'Selecciones';
  const featuredTitle = settings?.featuredTitle || 'España Local 26/27';
  const featuredRatingText = settings?.featuredRatingText || '(42 opiniones verificadas)';
  const featuredPromoText = isHalloween ? '🎃 Estampado Nombre & Dorsal Embrujado' : (settings?.featuredPromoText || 'Estampado Nombre & Dorsal');
  const featuredPromoBadge = isHalloween ? '¡GRATIS! 👻' : (settings?.featuredPromoBadge || '¡GRATIS! 🎁');

  const heroTagline = isHalloween ? '🎃 TEMPORADA HALLOWEEN / SPOOKY SEASON 👻' : (settings?.heroTagline || 'NEW ARRIVAL / TEMPORADA 24-25');
  const heroMainTitle = settings?.heroMainTitle || 'PASIÓN EN CADA PIEL';
  const heroSubtitle = isHalloween
    ? '¡Celebra el mes del terror con OFFSIDE! Consigue las camisetas oficiales de tus equipos favoritos, selecciones y clásicos con personalización y estampados de miedo 100% gratuitos.'
    : (settings?.heroSubtitle || 'Consigue las camisetas oficiales de tus equipos favoritos, selecciones nacionales y ediciones históricas retro. Personaliza con tu nombre y dorsal oficial de cada liga.');

  return (
    <section className={`relative text-white overflow-hidden border-b border-white/10 py-12 md:py-20 transition-colors duration-500 ${
      isHalloween ? 'bg-gradient-to-b from-[#0e0702] via-[#09060b] to-[#0a0a0a]' : 'bg-[#0a0a0a]'
    }`}>
      
      {/* Massive Background Watermark Typography & Wave Contour Lines */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none overflow-hidden">
        <h1 className={`text-[18rem] sm:text-[28rem] lg:text-[38rem] font-black italic tracking-tighter uppercase whitespace-nowrap ${
          isHalloween ? 'text-orange-500' : 'text-[#00e652]'
        }`}>
          {isHalloween ? 'HALLOWEEN' : 'OFFSIDE'}
        </h1>
      </div>

      {/* Brand Flowing Energy Wavy Contour Lines Background */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <g stroke={isHalloween ? '#ff6b00' : '#00e652'} strokeWidth="1" fill="none" opacity={isHalloween ? 0.8 : 0.6}>
          <path d="M-100 100 C 300 400, 600 0, 1200 300 C 1800 600, 1500 100, 2000 400" />
          <path d="M-100 120 C 300 420, 600 20, 1200 320 C 1800 620, 1500 120, 2000 420" />
          <path d="M-100 140 C 300 440, 600 40, 1200 340 C 1800 640, 1500 140, 2000 440" />
          <path d="M-100 160 C 300 460, 600 60, 1200 360 C 1800 660, 1500 160, 2000 460" />
          <path d="M-100 180 C 300 480, 600 80, 1200 380 C 1800 680, 1500 180, 2000 480" />
        </g>
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Tag */}
            <div className={`inline-flex items-center gap-2 border px-3 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase ${
              isHalloween ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'
            }`}>
              <span className={`w-2 h-2 rounded-full animate-ping ${isHalloween ? 'bg-orange-500' : 'bg-[#00e652]'}`} />
              <span className={isHalloween ? 'text-orange-400' : 'text-[#00e652]'}>{heroTagline}</span>
            </div>

            {/* Main Bold Headline */}
            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] sm:leading-[0.85] text-white">
              {heroMainTitle.includes('EN') ? (
                <>
                  {heroMainTitle.split('EN')[0]} EN <br />
                  <span className={`underline decoration-wavy ${
                    isHalloween ? 'text-orange-500 decoration-orange-500/50' : 'text-[#00e652] decoration-[#00e652]/40'
                  }`}>
                    {heroMainTitle.split('EN').slice(1).join('EN').trim()}
                  </span>
                </>
              ) : (
                <span className="text-white">{heroMainTitle}</span>
              )}
            </h1>

            <p className="text-white/70 text-xs sm:text-base max-w-xl font-medium leading-relaxed">
              {heroSubtitle}
            </p>

            {/* Value Props Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-1 text-[10px] sm:text-xs font-black uppercase tracking-wider">
              <div className={`flex items-center gap-2 border p-2.5 sm:p-3 rounded-xl text-white ${
                isHalloween ? 'bg-orange-950/20 border-orange-500/20' : 'bg-white/5 border-white/10'
              }`}>
                <CheckCircle2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`} />
                <span>Calidad AAAA Premium</span>
              </div>
              <div className={`flex items-center gap-2 border p-2.5 sm:p-3 rounded-xl text-white ${
                isHalloween ? 'bg-orange-950/20 border-orange-500/20' : 'bg-white/5 border-white/10'
              }`}>
                <CheckCircle2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`} />
                <span>{isHalloween ? 'Estampado Gratis 🎃' : 'Estampado Oficial'}</span>
              </div>
              <div className={`col-span-2 sm:col-span-1 flex items-center gap-2 border p-2.5 sm:p-3 rounded-xl text-white ${
                isHalloween ? 'bg-orange-950/20 border-orange-500/20' : 'bg-white/5 border-white/10'
              }`}>
                <CheckCircle2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`} />
                <span>Garantía de Satisfacción</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-2 sm:pt-4">
              <button
                onClick={onExploreClick}
                className={`flex-1 sm:flex-none font-black px-6 sm:px-8 py-3.5 sm:py-4 uppercase text-xs sm:text-sm tracking-widest skew-x-[-10deg] transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 sm:gap-3 group ${
                  isHalloween
                    ? 'bg-orange-500 hover:bg-white text-black shadow-orange-500/30'
                    : 'bg-[#00e652] hover:bg-white text-black'
                }`}
              >
                <div className="skew-x-[10deg] flex items-center gap-2">
                  <span>{isHalloween ? 'Explorar Colección de Terror 🎃' : 'Explorar Catálogo'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button
                onClick={() => onSelectLeague('Clásicos Retro')}
                className={`flex-1 sm:flex-none text-white border font-black px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isHalloween ? 'bg-white/5 hover:bg-orange-500/20 border-orange-500/30 hover:border-orange-500' : 'bg-white/5 hover:bg-white/10 border-white/20'
                }`}
              >
                <Trophy className={`w-4 h-4 ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`} />
                <span>Colección Retro</span>
              </button>

              {onExploreBalls && (
                <button
                  onClick={onExploreBalls}
                  className={`flex-1 sm:flex-none border font-black px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isHalloween
                      ? 'bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-black border-orange-500/40'
                      : 'bg-[#00e652]/10 hover:bg-[#00e652] text-[#00e652] hover:text-black border-[#00e652]/40'
                  }`}
                >
                  <span className="text-base">{isHalloween ? '🦇' : '⚽'}</span>
                  <span>Ver Balones</span>
                </button>
              )}

              {onOpenAdminToHero && (
                <button
                  onClick={onOpenAdminToHero}
                  className={`px-3.5 py-3.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    isHalloween
                      ? 'bg-white/5 hover:bg-orange-500 text-white/70 hover:text-black border border-orange-500/30'
                      : 'bg-white/5 hover:bg-[#00e652] text-white/70 hover:text-black border border-white/10'
                  }`}
                  title="Editar textos e imagen de este banner desde el Panel Admin"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Editar Portada</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className={`relative w-full max-w-md p-4 sm:p-6 rounded-3xl shadow-2xl overflow-hidden group transition-all duration-300 ${
              isHalloween
                ? 'bg-gradient-to-b from-[#18110b] via-[#120e14] to-black border border-orange-500/40 shadow-orange-950/60'
                : 'bg-[#121212] border border-white/10'
            }`}>
              
              {/* Quick Admin Edit Button on top left */}
              {onOpenAdminToHero && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAdminToHero();
                  }}
                  className={`absolute top-4 left-4 z-20 text-[11px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-xl backdrop-blur-md hover:scale-105 ${
                    isHalloween
                      ? 'bg-black/90 hover:bg-orange-500 text-orange-400 hover:text-black border border-orange-500/50'
                      : 'bg-black/90 hover:bg-[#00e652] text-[#00e652] hover:text-black border border-[#00e652]/50'
                  }`}
                  title="Editar imagen, títulos y contenido de esta tarjeta en el panel administrativo"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>EDITAR PORTADA</span>
                </button>
              )}

              <div className={`absolute top-4 right-4 text-black font-black text-[10px] uppercase px-3 py-1 rounded-sm z-10 tracking-widest ${
                isHalloween ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 'bg-[#00e652]'
              }`}>
                {featuredBadge}
              </div>

              {/* Jersey Image Showcase */}
              <div 
                onClick={onExploreClick}
                className="relative h-64 sm:h-80 w-full overflow-hidden rounded-2xl bg-black flex items-center justify-center border border-white/10 cursor-pointer"
              >
                <img
                  src={featuredImage}
                  alt={featuredTitle}
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <p className={`text-xs font-black uppercase tracking-widest ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`}>{featuredLeague}</p>
                  <h3 className="text-xl font-black italic uppercase text-white tracking-tight">{featuredTitle}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-amber-400 text-xs">★★★★★</span>
                    <span className="text-xs text-white/60 font-bold">{featuredRatingText}</span>
                  </div>
                </div>
              </div>

              {/* Stamp feature teaser */}
              <div className="mt-4 p-3.5 bg-black rounded-xl border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`} />
                  <span className="text-white/80 font-bold text-[11px] sm:text-xs">{featuredPromoText}</span>
                </div>
                <span className={`font-black uppercase text-[10px] px-2.5 py-1 rounded whitespace-nowrap border ${
                  isHalloween
                    ? 'text-orange-400 bg-orange-500/10 border-orange-500/40'
                    : 'text-[#00e652] bg-[#00e652]/10 border-[#00e652]/40'
                }`}>
                  {featuredPromoBadge}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Quick League Filter Bar */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-black mb-3 flex items-center gap-2">
            <span>SELECCIONA POR LIGA O TORNEO:</span>
          </p>
          <div className="flex overflow-x-auto pb-2 gap-2 sm:gap-2.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {leagueBadges.map((badge) => {
              const isSelected = selectedLeague === badge.id;
              return (
                <button
                  key={badge.id}
                  onClick={() => onSelectLeague(badge.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer rounded-lg sm:rounded-none ${
                    isSelected
                      ? isHalloween ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/30' : 'bg-[#00e652] text-black shadow-lg shadow-[#00e652]/20'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                  }`}
                >
                  <span className="text-sm">{badge.icon}</span>
                  <span className="whitespace-nowrap">{badge.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

