import React, { useState } from 'react';
import { ShoppingBag, Star, Check, Eye } from 'lucide-react';
import { Jersey, Size } from '../types';
import { formatPrice } from '../utils/storage';

interface JerseyCardProps {
  jersey: Jersey;
  currency: 'USD' | 'COP';
  onQuickAdd: (jersey: Jersey, size: Size) => void;
  onOpenDetail: (jersey: Jersey) => void;
}

export const JerseyCard: React.FC<JerseyCardProps> = ({
  jersey,
  currency,
  onQuickAdd,
  onOpenDetail
}) => {
  const [selectedSize, setSelectedSize] = useState<Size>(jersey.sizesAvailable[0] || 'M');
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(jersey, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div 
      onClick={() => onOpenDetail(jersey)}
      className="group bg-[#121212] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ccff00]/60 transition-all duration-300 hover:shadow-2xl hover:shadow-[#ccff00]/10 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Badges Overlay */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
        {jersey.type === 'Retro' && (
          <span className="bg-amber-400 text-black font-black text-[8px] sm:text-[10px] uppercase px-1.5 sm:px-2.5 py-0.5 rounded-sm shadow">
            CLÁSICO RETRO
          </span>
        )}
        {jersey.isPopular && jersey.type !== 'Retro' && (
          <span className="bg-[#ccff00] text-black font-black text-[8px] sm:text-[10px] uppercase px-1.5 sm:px-2.5 py-0.5 rounded-sm shadow">
            MÁS VENDIDA
          </span>
        )}
        {jersey.badgeTags && jersey.badgeTags.map((tag, idx) => (
          <span key={idx} className="bg-black/90 text-[#ccff00] border border-white/20 font-black text-[8px] sm:text-[9px] uppercase px-1.5 py-0.5 rounded-sm">
            {tag}
          </span>
        ))}
      </div>

      {/* Stock indicator */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 pointer-events-none">
        {jersey.stock > 0 ? (
          <span className="bg-black/80 backdrop-blur text-[#ccff00] text-[8px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-sm border border-white/20 flex items-center gap-1">
            <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#ccff00] animate-ping" />
            {jersey.stock <= 10 ? `¡Solo ${jersey.stock}!` : 'En Stock'}
          </span>
        ) : (
          <span className="bg-rose-950 text-rose-400 text-[8px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-sm border border-rose-800">
            Agotada
          </span>
        )}
      </div>

      <div>
        {/* Image Container */}
        <div className="relative h-44 sm:h-64 lg:h-72 w-full bg-black overflow-hidden flex items-center justify-center p-1.5 sm:p-2 border-b border-white/10">
          <img
            src={jersey.image}
            alt={jersey.name}
            className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-500 rounded-xl"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />

          {/* Hover Overlay CTA */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
            <button 
              onClick={(e) => { e.stopPropagation(); onOpenDetail(jersey); }}
              className="bg-[#ccff00] hover:bg-white text-black font-black px-4 py-2.5 text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl skew-x-[-10deg] cursor-pointer"
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <Eye className="w-4 h-4 stroke-[3]" />
                <span>Ver Detalles</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2">
          {/* League & Season */}
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-black uppercase tracking-wider">
            <span className="text-[#ccff00] truncate max-w-[100px] sm:max-w-none">{jersey.league}</span>
            <span className="bg-white/10 px-1.5 py-0.5 rounded text-white/80 font-mono text-[9px] sm:text-[10px]">{jersey.yearSeason}</span>
          </div>

          {/* Name */}
          <h3 className="text-xs sm:text-base font-black italic uppercase text-white line-clamp-2 group-hover:text-[#ccff00] transition-colors leading-tight tracking-tight">
            {jersey.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-black text-amber-400">{jersey.rating.toFixed(1)}</span>
            <span className="text-white/40 text-[9px] sm:text-[11px] font-bold">({jersey.reviewsCount})</span>
            <span className="hidden sm:inline mx-1 text-white/20">•</span>
            <span className="hidden sm:inline text-white/60 text-[11px] uppercase font-bold">{jersey.type}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-base sm:text-2xl font-black text-white tracking-tight">
              {formatPrice(jersey.price, currency)}
            </span>
            {jersey.originalPrice && (
              <span className="text-[10px] sm:text-xs text-white/40 line-through font-bold">
                {formatPrice(jersey.originalPrice, currency)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Controls: Size selector & Quick Add */}
      <div className="p-2.5 sm:p-4 pt-0 space-y-2 sm:space-y-3 border-t border-white/10 mt-1 sm:mt-2">
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="flex items-center justify-between gap-1 pt-1.5 sm:pt-2"
        >
          <span className="text-[9px] sm:text-[10px] uppercase text-white/50 font-black tracking-widest">Talla:</span>
          <div className="flex gap-0.5 sm:gap-1">
            {jersey.sizesAvailable.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-5 h-5 sm:w-7 sm:h-7 rounded-none text-[9px] sm:text-[11px] font-black transition-all cursor-pointer ${
                  selectedSize === size
                    ? 'bg-[#ccff00] text-black font-black'
                    : 'bg-white/5 text-white/80 hover:bg-white/20 border border-white/10'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={jersey.stock <= 0}
          className={`w-full py-2 sm:py-2.5 uppercase font-black tracking-widest text-[9px] sm:text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
            added
              ? 'bg-emerald-500 text-black'
              : jersey.stock > 0
              ? 'bg-[#ccff00] hover:bg-white text-black skew-x-[-10deg]'
              : 'bg-white/5 text-white/40 border border-white/10 cursor-not-allowed'
          }`}
        >
          <div className={jersey.stock > 0 ? "skew-x-[10deg] flex items-center gap-1.5 sm:gap-2" : "flex items-center gap-1.5 sm:gap-2"}>
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="truncate">¡AGREGADA!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="truncate">{jersey.stock > 0 ? 'AGREGAR' : 'AGOTADA'}</span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

