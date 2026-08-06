export interface StoreSettings {
  contactPhone: string;
  contactEmail: string;
  customizationPriceUSD: number;
  shippingFeeUSD: number;
}

export type League = 
  | 'LaLiga'
  | 'Premier League'
  | 'Serie A'
  | 'Ligue 1'
  | 'Bundesliga'
  | 'Liga BetPlay'
  | 'Selecciones'
  | 'Clásicos Retro';

export type JerseyType = 'Local' | 'Visitante' | 'Tercera' | 'Edición Especial' | 'Retro';

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
  price: number; // in USD or converted COP
  originalPrice?: number;
  yearSeason: string;
  type: JerseyType;
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

export type PaymentMethod = 'card' | 'sinpe_movil' | 'paypal' | 'cash';

export type OrderStatus = 'Pendiente' | 'En Proceso' | 'Enviado' | 'Entregado' | 'Cancelado';

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
  selectedLeague: string; // 'all' or specific League
  selectedTeam: string; // 'all' or specific team
  selectedType: string; // 'all' or JerseyType
  selectedSize: string; // 'all' or Size
  minPrice: number;
  maxPrice: number;
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
