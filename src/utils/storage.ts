import { Jersey, CartItem, Order, Review, StoreSettings, DiscountCode } from '../types';
import { INITIAL_JERSEYS, INITIAL_REVIEWS } from '../data/mockData';

const KEYS = {
  JERSEYS: 'offside_jerseys_cr_v3',
  CART: 'offside_cart_cr_v2',
  ORDERS: 'offside_orders_cr_v3',
  REVIEWS: 'offside_reviews_cr_v2',
  CURRENCY: 'offside_currency_cr_v2',
  SETTINGS: 'offside_settings_cr_v2',
  DISCOUNT_CODES: 'offside_discount_codes_cr_v1',
};

export const DEFAULT_SETTINGS: StoreSettings = {
  contactPhone: '+506 8559 5192',
  contactEmail: 'contacto@offsidesports.cr',
  customizationPriceCRC: 0,
  customizationPriceUSD: 0,
  shippingFeeCRC: 2600,
  shippingFeeUSD: 5,
  bankAccountHolder: 'OFFSIDE Sports Costa Rica S.A.',
  bankAccountIBAN: 'CR05015202001026384920',
  bankName: 'BAC Credomatic Costa Rica',
  sinpePhone: '+506 8559 5192',
  heroTagline: 'NEW ARRIVAL / TEMPORADA 24-25',
};

export const DEFAULT_DISCOUNT_CODES: DiscountCode[] = [
  { id: 'dc-1', code: 'OFFSIDE10', percentage: 10, active: true },
  { id: 'dc-2', code: 'GOLAZO', percentage: 15, active: true },
  { id: 'dc-3', code: 'BIENVENIDO', percentage: 20, active: true },
  { id: 'dc-4', code: 'CR7', percentage: 15, active: true },
];

// Rate conversion: 1 USD = 520 CRC (Colones Costa Rica)
export const CRC_RATE = 520;

export function formatPrice(amountUSD: number, currency: 'CRC' | 'USD'): string {
  if (currency === 'CRC') {
    const crc = Math.round(amountUSD * CRC_RATE);
    return `₡${crc.toLocaleString('es-CR')}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(amountUSD);
}

export function formatCRC(amountCRC: number): string {
  return `₡${Math.round(amountCRC).toLocaleString('es-CR')}`;
}

// JERSEYS CRUD
export function getStoredJerseys(): Jersey[] {
  try {
    const raw = localStorage.getItem(KEYS.JERSEYS);
    if (!raw) {
      localStorage.setItem(KEYS.JERSEYS, JSON.stringify(INITIAL_JERSEYS));
      return INITIAL_JERSEYS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading jerseys from storage', e);
    return INITIAL_JERSEYS;
  }
}

export function saveJerseys(jerseys: Jersey[]): void {
  try {
    localStorage.setItem(KEYS.JERSEYS, JSON.stringify(jerseys));
  } catch (e) {
    console.warn('Quota exceeded when saving jerseys, attempting lightweight save...', e);
    try {
      // Strip extra galleries if quota exceeded
      const sanitized = jerseys.map(j => ({
        ...j,
        images: (j.images || []).slice(0, 2)
      }));
      localStorage.setItem(KEYS.JERSEYS, JSON.stringify(sanitized));
    } catch (err) {
      console.error('Error saving jerseys to local storage', err);
    }
  }
}

// CART PERSISTENCE
export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  try {
    // Sanitize cart items to avoid heavy gallery payloads in cart state
    const sanitizedCart = cart.map(item => ({
      ...item,
      jersey: {
        id: item.jersey.id,
        name: item.jersey.name,
        team: item.jersey.team,
        league: item.jersey.league,
        price: item.jersey.price,
        discountPercent: item.jersey.discountPercent,
        image: item.jersey.image,
        backImage: item.jersey.backImage,
        type: item.jersey.type,
        sizesAvailable: item.jersey.sizesAvailable,
        stock: item.jersey.stock,
        rating: item.jersey.rating,
        reviewsCount: item.jersey.reviewsCount
      }
    }));
    localStorage.setItem(KEYS.CART, JSON.stringify(sanitizedCart));
  } catch (e) {
    console.warn('Quota exceeded in saveCart, attempting lightweight fallback...', e);
    try {
      const lightweightCart = cart.map(item => ({
        ...item,
        jersey: {
          id: item.jersey.id,
          name: item.jersey.name,
          team: item.jersey.team,
          league: item.jersey.league,
          price: item.jersey.price,
          sizesAvailable: item.jersey.sizesAvailable,
          stock: item.jersey.stock,
          rating: item.jersey.rating,
          reviewsCount: item.jersey.reviewsCount
        }
      }));
      localStorage.setItem(KEYS.CART, JSON.stringify(lightweightCart));
    } catch (err) {
      console.error('Error saving cart to local storage', err);
    }
  }
}

// ORDERS PERSISTENCE - Clean with no sample orders
export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEYS.ORDERS);
    if (!raw) {
      // Empty by default as requested (no mock orders)
      localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders', e);
  }
}

// REVIEWS PERSISTENCE
export function getStoredReviews(): Review[] {
  try {
    const raw = localStorage.getItem(KEYS.REVIEWS);
    if (!raw) {
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REVIEWS;
  }
}

export function saveReviews(reviews: Review[]): void {
  try {
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (e) {
    console.error('Error saving reviews', e);
  }
}

// CURRENCY PREFERENCE - Defaults to CRC (Colones Costa Rica)
export function getStoredCurrency(): 'CRC' | 'USD' {
  try {
    const raw = localStorage.getItem(KEYS.CURRENCY);
    return raw === 'USD' ? 'USD' : 'CRC';
  } catch (e) {
    return 'CRC';
  }
}

export function saveCurrency(currency: 'CRC' | 'USD'): void {
  try {
    localStorage.setItem(KEYS.CURRENCY, currency);
  } catch (e) {
    console.error('Error saving currency', e);
  }
}

// STORE SETTINGS PERSISTENCE
export function getStoredSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

// DISCOUNT CODES PERSISTENCE
export function getStoredDiscountCodes(): DiscountCode[] {
  try {
    const raw = localStorage.getItem(KEYS.DISCOUNT_CODES);
    if (!raw) {
      localStorage.setItem(KEYS.DISCOUNT_CODES, JSON.stringify(DEFAULT_DISCOUNT_CODES));
      return DEFAULT_DISCOUNT_CODES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_DISCOUNT_CODES;
  }
}

export function saveDiscountCodes(codes: DiscountCode[]): void {
  try {
    localStorage.setItem(KEYS.DISCOUNT_CODES, JSON.stringify(codes));
  } catch (e) {
    console.error('Error saving discount codes', e);
  }
}
