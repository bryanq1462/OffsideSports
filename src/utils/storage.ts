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
  heroMainTitle: 'PASIÓN EN CADA PIEL',
  heroSubtitle: 'Consigue las camisetas oficiales de tus equipos favoritos, selecciones nacionales y ediciones históricas retro. Personaliza con tu nombre y dorsal oficial de cada liga.',
  featuredBadge: 'EDICIÓN DESTACADA',
  featuredLeague: 'LaLiga EA Sports',
  featuredTitle: 'Real Madrid Local 2024/25',
  featuredImage: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=800',
  featuredRatingText: '(42 opiniones verificadas)',
  featuredPromoText: 'Estampado Nombre & Dorsal',
  featuredPromoBadge: '¡GRATIS! 🎁',
  instagramHandle: '@OFFSIDE_SPORTS22',
  instagramUrl: 'https://www.instagram.com/offside_sports22?igsh=MXZib2J3cjV2bnl1YQ==',
  whatsappPhone: '+506 8559 5192'
};

export const DEFAULT_DISCOUNT_CODES: DiscountCode[] = [
  { id: 'dc-1', code: 'OFFSIDE10', percentage: 10, active: true },
  { id: 'dc-2', code: 'GOLAZO', percentage: 15, active: true },
  { id: 'dc-3', code: 'BIENVENIDO', percentage: 20, active: true },
  { id: 'dc-4', code: 'CR7', percentage: 15, active: true },
];

// Rate conversion: 1 USD = 520 CRC (Colones Costa Rica)
export const CRC_RATE = 520;

/**
 * Normalizes CRC prices from USD values by eliminating floating-point rounding errors
 * (e.g. $48.08 -> 25001.6 rounded to 25002 instead of 25000, $38.46 -> 19999.2 instead of 20000).
 */
export function getCleanCRC(amountUSD: number): number {
  if (isNaN(amountUSD) || amountUSD <= 0) return 0;
  const rawCRC = amountUSD * CRC_RATE;
  const roundedCRC = Math.round(rawCRC);

  // Snap to clean 1000, 500, or 100 multiples if deviation is caused by 2-decimal USD rounding
  const round1000 = Math.round(rawCRC / 1000) * 1000;
  if (Math.abs(rawCRC - round1000) <= 2.8) return round1000;

  const round500 = Math.round(rawCRC / 500) * 500;
  if (Math.abs(rawCRC - round500) <= 2.8) return round500;

  const round100 = Math.round(rawCRC / 100) * 100;
  if (Math.abs(rawCRC - round100) <= 2.8) return round100;

  return roundedCRC;
}

export function formatPrice(amount: number, currency: 'CRC' | 'USD' = 'CRC', exactCRC?: number): string {
  // If exactCRC is provided, use it
  let crc = typeof exactCRC === 'number' && !isNaN(exactCRC) && exactCRC > 0
    ? exactCRC
    : (amount >= 500 ? amount : getCleanCRC(amount));

  if (currency === 'USD') {
    const usd = Number((crc / CRC_RATE).toFixed(2));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(usd);
  }

  // Format in Costa Rican Colones (₡)
  return `₡${Math.round(crc).toLocaleString('es-CR')}`;
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
    const parsed: Jersey[] = JSON.parse(raw);
    let changed = false;
    const sanitized = parsed.map(j => {
      let item = { ...j };

      // Convert any legacy USD prices (< 1000) directly to clean Costa Rican Colones
      if (typeof item.price === 'number') {
        if (item.price < 1000) {
          if (item.priceCRC && item.priceCRC >= 1000) {
            item.price = item.priceCRC;
          } else {
            const cleanVal = getCleanCRC(item.price);
            item.price = cleanVal >= 10000 ? cleanVal : 25000;
          }
          changed = true;
        }
      } else {
        item.price = 25000;
        changed = true;
      }
      item.price = Math.round(item.price);
      if (item.priceCRC !== item.price) {
        item.priceCRC = item.price;
        changed = true;
      }

      // Check original/crossed-out price
      if (item.originalPrice) {
        if (item.originalPrice < 1000) {
          if (item.originalPriceCRC && item.originalPriceCRC >= 1000) {
            item.originalPrice = item.originalPriceCRC;
          } else {
            const cleanOrig = getCleanCRC(item.originalPrice);
            item.originalPrice = cleanOrig >= 10000 ? cleanOrig : Math.round(item.price * 1.25);
          }
          changed = true;
        }
        item.originalPrice = Math.round(item.originalPrice);
        if (item.originalPriceCRC !== item.originalPrice) {
          item.originalPriceCRC = item.originalPrice;
          changed = true;
        }
      }

      return item;
    });
    if (changed) {
      try {
        localStorage.setItem(KEYS.JERSEYS, JSON.stringify(sanitized));
      } catch (ignore) {}
    }
    return sanitized;
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
