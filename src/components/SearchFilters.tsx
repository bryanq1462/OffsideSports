import React from 'react';
import { Search, RotateCcw, SlidersHorizontal, Trophy, Shield } from 'lucide-react';
import { FilterState, League, JerseyType } from '../types';
import { TEAMS_BY_LEAGUE } from '../data/mockData';

interface SearchFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  leagues: League[];
  availableTeams: string[];
  totalResults: number;
  onReset: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  setFilters,
  leagues,
  availableTeams,
  totalResults,
  onReset
}) => {
  const types: JerseyType[] = ['Local', 'Visitante', 'Tercera', 'Edición Especial', 'Retro'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Calculate teams dynamically based on selected league
  const filteredTeams = filters.selectedLeague !== 'all'
    ? (TEAMS_BY_LEAGUE[filters.selectedLeague] || [])
    : availableTeams;

  return (
    <div className="bg-[#121212] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
            <SlidersHorizontal className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase text-white tracking-wider">BUSCADOR & FILTROS</h2>
            <p className="text-xs text-white/60 font-semibold">Encuentra la camiseta exacta por Liga, Equipo, Talla o Edición</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-black text-[#ccff00] text-xs font-black uppercase px-3 py-1.5 border border-white/20 tracking-wider">
            {totalResults} {totalResults === 1 ? 'CAMISETA ENCONTRADA' : 'CAMISETAS ENCONTRADAS'}
          </span>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-white/80 hover:text-[#ccff00] text-xs font-black uppercase tracking-wider bg-white/5 hover:bg-white/10 px-3.5 py-1.5 border border-white/20 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>LIMPIAR</span>
          </button>
        </div>
      </div>

      {/* Primary Row: Search Text & Sort By */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Search Query Input */}
        <div className="md:col-span-8 relative">
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-[#ccff00] mb-1.5">
            BUSCAR POR EQUIPO, JUGADOR O DORSAL:
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Ej: Zidane, Mbappé, Real Madrid, Colombia, Retro 2002..."
              className="w-full bg-black border border-white/20 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-white placeholder-white/40 focus:outline-none focus:border-[#ccff00] transition-colors"
            />
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Sort selector */}
        <div className="md:col-span-4">
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-[#ccff00] mb-1.5">
            ORDENAR RESULTADOS:
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="w-full bg-black border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white font-black uppercase focus:outline-none focus:border-[#ccff00]"
          >
            <option value="recommended">Destacados & Populares</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating">Mejor Valorados (Estrellas)</option>
            <option value="newest">Más Recientes 2024/25</option>
          </select>
        </div>

      </div>

      {/* Secondary Row: Liga & Equipo Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* League Selector */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-[#ccff00] mb-1.5 flex items-center gap-1">
            <Trophy className="w-3 h-3 text-[#ccff00]" />
            <span>LIGA / TORNEO:</span>
          </label>
          <select
            value={filters.selectedLeague}
            onChange={(e) => {
              const newLeague = e.target.value;
              setFilters(prev => ({
                ...prev,
                selectedLeague: newLeague,
                selectedTeam: 'all' // Reset team when changing league
              }));
            }}
            className="w-full bg-black border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white font-black uppercase focus:outline-none focus:border-[#ccff00]"
          >
            <option value="all">Todas las Ligas & Torneos</option>
            {leagues.map(lg => (
              <option key={lg} value={lg}>{lg}</option>
            ))}
          </select>
        </div>

        {/* Team Selector (Filtered dynamically!) */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-[#ccff00] mb-1.5 flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#ccff00]" />
            <span>EQUIPO / CLUB:</span>
          </label>
          <select
            value={filters.selectedTeam}
            onChange={(e) => setFilters(prev => ({ ...prev, selectedTeam: e.target.value }))}
            className="w-full bg-black border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white font-black uppercase focus:outline-none focus:border-[#ccff00]"
          >
            <option value="all">Todos los Equipos</option>
            {filteredTeams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        {/* Jersey Type */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-[#ccff00] mb-1.5">
            TIPO DE EDICIÓN:
          </label>
          <select
            value={filters.selectedType}
            onChange={(e) => setFilters(prev => ({ ...prev, selectedType: e.target.value }))}
            className="w-full bg-black border border-white/20 rounded-xl py-2.5 px-3 text-xs text-white font-black uppercase focus:outline-none focus:border-[#ccff00]"
          >
            <option value="all">Todas las Ediciones</option>
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-[#ccff00] mb-1.5">
            TALLA DISPONIBLE:
          </label>
          <div className="flex gap-1">
            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedSize: 'all' }))}
              className={`px-2.5 py-2 text-[11px] font-black uppercase transition cursor-pointer ${
                filters.selectedSize === 'all'
                  ? 'bg-[#ccff00] text-black font-black'
                  : 'bg-black text-white/60 border border-white/20'
              }`}
            >
              TODAS
            </button>
            {sizes.map(sz => (
              <button
                key={sz}
                onClick={() => setFilters(prev => ({ ...prev, selectedSize: sz }))}
                className={`flex-1 py-2 text-[11px] font-black transition cursor-pointer ${
                  filters.selectedSize === sz
                    ? 'bg-[#ccff00] text-black font-black'
                    : 'bg-black text-white/60 border border-white/20 hover:bg-white/10'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Active Filter Pills Bar */}
      {(filters.selectedLeague !== 'all' || filters.selectedTeam !== 'all' || filters.selectedType !== 'all' || filters.selectedSize !== 'all' || filters.searchQuery) && (
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-black uppercase">
          <span className="text-white/40 text-[10px] tracking-widest">FILTROS ACTIVOS:</span>
          
          {filters.selectedLeague !== 'all' && (
            <span className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/40 px-2.5 py-1 rounded-sm flex items-center gap-1.5">
              Liga: {filters.selectedLeague}
              <button onClick={() => setFilters(p => ({ ...p, selectedLeague: 'all' }))} className="hover:text-white font-black">✕</button>
            </span>
          )}

          {filters.selectedTeam !== 'all' && (
            <span className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/40 px-2.5 py-1 rounded-sm flex items-center gap-1.5">
              Equipo: {filters.selectedTeam}
              <button onClick={() => setFilters(p => ({ ...p, selectedTeam: 'all' }))} className="hover:text-white font-black">✕</button>
            </span>
          )}

          {filters.selectedType !== 'all' && (
            <span className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/40 px-2.5 py-1 rounded-sm flex items-center gap-1.5">
              Tipo: {filters.selectedType}
              <button onClick={() => setFilters(p => ({ ...p, selectedType: 'all' }))} className="hover:text-white font-black">✕</button>
            </span>
          )}

          {filters.selectedSize !== 'all' && (
            <span className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/40 px-2.5 py-1 rounded-sm flex items-center gap-1.5">
              Talla: {filters.selectedSize}
              <button onClick={() => setFilters(p => ({ ...p, selectedSize: 'all' }))} className="hover:text-white font-black">✕</button>
            </span>
          )}

          {filters.searchQuery && (
            <span className="bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/40 px-2.5 py-1 rounded-sm flex items-center gap-1.5">
              Búsqueda: "{filters.searchQuery}"
              <button onClick={() => setFilters(p => ({ ...p, searchQuery: '' }))} className="hover:text-white font-black">✕</button>
            </span>
          )}
        </div>
      )}

    </div>
  );
};

