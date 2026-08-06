import { Jersey, CartItem, Order, Review, StoreSettings } from '../types';
import { INITIAL_JERSEYS, INITIAL_REVIEWS } from '../data/mockData';

const KEYS = {
  JERSEYS: 'offside_jerseys_cr_v2',
  CART: 'offside_cart_cr_v2',
  ORDERS: 'offside_orders_cr_v3',
  REVIEWS: 'offside_reviews_cr_v2',
  CURRENCY: 'offside_currency_cr_v2',
  SETTINGS: 'offside_settings_cr_v1',
};

export const DEFAULT_SETTINGS: StoreSettings = {
  contactPhone: '+506 8559 5192',
  contactEmail: 'contacto@offsidesports.cr',
  customizationPriceCRC: 5200,
  customizationPriceUSD: 10,
  shippingFeeCRC: 2600,
  shippingFeeUSD: 5,
  bankAccountHolder: 'OFFSIDE Sports Costa Rica S.A.',
  bankAccountIBAN: 'CR05015202001026384920',
  bankName: 'BAC Credomatic Costa Rica',
  sinpePhone: '+506 8559 5192',
};

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
    console.error('Error saving jerseys', e);
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
    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart', e);
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
