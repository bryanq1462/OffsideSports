import { Ball } from '../types';

export const BALL_SIZES_CATALOG = [
  'Talla 5 (Oficial)',
  'Talla 4 (Juvenil)',
  'Talla 3 (Infantil)',
  'Fútbol Sala (Futsal)',
  'Mini Balón'
];

export const BALL_CATEGORIES_LIST = [
  'Oficial Pro Match',
  'Réplica Match',
  'Entrenamiento',
  'Fútbol Sala (Futsal)',
  'Colección / Retro',
  'Mini Balón'
] as const;

export const BALL_BRANDS = [
  'Adidas',
  'Nike',
  'Puma',
  'Select',
  'Molten',
  'Pioneer / UNAFUT',
  'Kipsta',
  'Otro'
];

// No mock balls auto-seeded into stock: users/admin can add products manually
export const INITIAL_BALLS: Ball[] = [];
