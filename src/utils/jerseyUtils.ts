import { JerseyVersion } from '../types';

export interface VersionInfo {
  label: string;
  shortLabel: string;
  icon: string;
  badgeClass: string;
  pillClass: string;
  description: string;
}

export function getJerseyVersionInfo(version?: string): VersionInfo {
  const v = version || 'Versión Jugador';
  const lower = v.toLowerCase();

  if (lower.includes('jugador') || lower.includes('player')) {
    return {
      label: 'Versión Jugador',
      shortLabel: 'Versión Jugador',
      icon: '⚡',
      badgeClass: 'bg-[#00e652] text-black border border-[#00e652] font-black',
      pillClass: 'bg-[#00e652]/10 text-[#00e652] border border-[#00e652]/30 font-black',
      description: 'Corte atlético ajustado al cuerpo, tejido micro-perforado ultraligero y logos termosellados de nivel profesional.'
    };
  }

  if (lower.includes('fan') || lower.includes('aficionado') || lower.includes('stadium')) {
    return {
      label: 'Versión Fan',
      shortLabel: 'Versión Fan',
      icon: '🧢',
      badgeClass: 'bg-sky-400 text-black border border-sky-400 font-black',
      pillClass: 'bg-sky-400/10 text-sky-300 border border-sky-400/30 font-black',
      description: 'Corte estándar cómodo para el día a día, con tela suave y resistente, y escudos bordados de máxima durabilidad.'
    };
  }

  if (lower.includes('manga larga') || lower.includes('long sleeve')) {
    return {
      label: 'Manga Larga',
      shortLabel: 'Manga Larga',
      icon: '🧥',
      badgeClass: 'bg-indigo-400 text-black border border-indigo-400 font-black',
      pillClass: 'bg-indigo-400/10 text-indigo-300 border border-indigo-400/30 font-black',
      description: 'Edición con mangas completas y puños acanalados, ideal para climas frescos y estilo deportivo.'
    };
  }

  if (lower.includes('chaqueta') || lower.includes('rompevientos')) {
    return {
      label: 'Chaqueta Rompevientos',
      shortLabel: 'Chaqueta Rompevientos',
      icon: '🌪️',
      badgeClass: 'bg-teal-400 text-black border border-teal-400 font-black',
      pillClass: 'bg-teal-400/10 text-teal-300 border border-teal-400/30 font-black',
      description: 'Prenda técnica con cremallera completa, tejido resistente al viento y repelente al agua.'
    };
  }

  if (lower.includes('conjunto')) {
    return {
      label: 'Conjunto Completo',
      shortLabel: 'Conjunto Completo',
      icon: '⚽',
      badgeClass: 'bg-amber-400 text-black border border-amber-400 font-black',
      pillClass: 'bg-amber-400/10 text-amber-300 border border-amber-400/30 font-black',
      description: 'Kit de dos piezas que incluye la camiseta oficial combinada con su respectivo short a juego.'
    };
  }

  return {
    label: v,
    shortLabel: v,
    icon: '🏷️',
    badgeClass: 'bg-white/20 text-white border border-white/30 font-black',
    pillClass: 'bg-white/10 text-white border border-white/20 font-black',
    description: `Edición especial: ${v}`
  };
}
