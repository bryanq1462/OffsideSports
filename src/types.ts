export interface StoreSettings {
  contactPhone: string;
  contactEmail: string;
  customizationPriceCRC: number;
  customizationPriceUSD: number;
  shippingFeeCRC: number;
  shippingFeeUSD: number;
  bankAccountHolder: string;
  bankAccountIBAN: string;
  bankName: string;
  sinpePhone: string;
}

export type SportCategory = 'Fútbol' | 'Basketball' | 'Béisbol' | 'Fórmula 1' | 'Fútbol Americano';

export type League = 
  | 'Liga Promerica (CR)'
  | 'UEFA Champions League'
  | 'LaLiga'
  | 'Premier League'
  | 'Serie A'
  | 'Ligue 1'
  | 'Bundesliga'
  | 'MLS'
  | 'Saudi Pro League'
  | 'Liga Argentina'
  | 'Brasileirão'
  | 'Liga BetPlay'
  | 'Selecciones'
  | 'Clásicos Retro'
  | 'NBA'
  | 'MLB'
  | 'F1'
  | 'NFL';

export type JerseyType = 'Local' | 'Visitante' | 'Tercera' | 'Edición Especial' | 'Retro';

export type JerseyVersion = 'Versión Jugador (Player Issue)' | 'Versión Fan (Aficionado)' | 'Manga Larga' | 'Chaqueta / Rompevientos' | 'Conjunto Completo';

export type GenderCategory = 'Unisex (Adulto)' | 'Femenina (Mujer)' | 'Niños / Infantil';

export type Size = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface CustomStamping {
  enabled: boolean;
  name: string;
  number: string;
  patch?: string; // e.g., 'Champions League', 'World Cup', 'Liga Patch'
}

export interface Jersey {
  id: string;
  name: string;
  team: string;
  league: League;
  sportCategory?: SportCategory;
  price: number; // in USD or converted COP
  originalPrice?: number;
  yearSeason: string;
  type: JerseyType;
  version?: JerseyVersion;
  genderCategory?: GenderCategory;
  image: string;
  backImage?: string;
  images?: string[];
  sizesAvailable: Size[];
  description: string;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isNew?: boolean;
  stock: number;
  badgeTags?: string[];
  fabricInfo?: string;
}

export interface CartItem {
  cartItemId: string; // unique ID including custom options
  jersey: Jersey;
  size: Size;
  quantity: number;
  customStamping?: CustomStamping;
}

export type PaymentMethod = 'card' | 'sinpe_movil' | 'bank_transfer' | 'paypal' | 'cash';

export type OrderStatus = 
  | 'Solicitado'
  | 'Empaquetando'
  | 'Listo'
  | 'Proceso de entrega'
  | 'Entregado'
  | 'Cancelado'
  | 'Pendiente'
  | 'En Proceso'
  | 'Enviado';

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface Order {
  id: string;
  date: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    cardLast4?: string;
    referenceCode?: string;
  };
  status: OrderStatus;
  currency: 'CRC' | 'USD';
}

export interface Review {
  id: string;
  jerseyId?: string;
  jerseyName: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  photoUrl?: string;
  team?: string;
}

export interface FilterState {
  searchQuery: string;
  selectedSport: string; // 'all' or SportCategory
  selectedLeague: string; // 'all' or specific League
  selectedTeam: string; // 'all' or specific team
  selectedType: string; // 'all' or JerseyType
  selectedSize: string; // 'all' or Size
  minPrice: number;
  maxPrice: number;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
