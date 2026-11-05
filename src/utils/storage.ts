import { Jersey, CartItem, Order, Review, StoreSettings, DiscountCode, Ball } from '../types';
import { INITIAL_JERSEYS, INITIAL_REVIEWS } from '../data/mockData';
import { INITIAL_BALLS } from '../data/mockBalls';
import { DEFAULT_JERSEY_FALLBACK_IMAGE } from './imageUtils';

const KEYS = {
  JERSEYS: 'offside_jerseys_cr_v3',
  BALLS: 'offside_balls_cr_v1',
  CART: 'offside_cart_cr_v2',
  ORDERS: 'offside_orders_cr_v3',
  REVIEWS: 'offside_reviews_cr_v2',
  CURRENCY: 'offside_currency_cr_v2',
  SETTINGS: 'offside_settings_cr_v2',
  DISCOUNT_CODES: 'offside_discount_codes_cr_v1',
};

export const DEFAULT_SETTINGS: StoreSettings = {
  themeMode: 'christmas',
  customizationPriceCRC: 0,
  bankAccountHolder: "OFFSIDE Sports Costa Rica S.A.",
  featuredPromoBadge: "¡GRATIS! 🎁",
  heroTagline: "TEMPORADA 26-27",
  sinpePhone: "+50685595192",
  heroMainTitle: "HISTORIA EN CADA CHEMA",
  featuredImage: "/images/hero-featured.jpg",
  featuredTitle: "España Local 26/27",
  heroSubtitle: "Consigue las camisetas oficiales de tus equipos favoritos, selecciones nacionales y ediciones retro. Personaliza con dorsal oficial de cada liga.",
  bankAccountIBAN: "CR05015202001026384920",
  instagramHandle: "@OFFSIDE_SPORTS22",
  shippingFeeCRC: 3500,
  shippingFeeUSD: 6.73,
  customizationPriceUSD: 0,
  featuredLeague: "Selecciones",
  adminPassword: "Offside2025",
  featuredBadge: "EDICIÓN DESTACADA",
  featuredRatingText: "(42 opiniones verificadas)",
  featuredPromoText: "Estampado Nombre & Dorsal",
  contactPhone: "+50685595192",
  whatsappPhone: "+506 8559 5192",
  bankName: "Banco de Costa Rica",
  adminEmail: "bryanq1462@gmail.com",
  instagramUrl: "https://www.instagram.com/offside_sports22?igsh=MXZib2J3cjV2bnl1YQ==",
  contactEmail: "svargasv22@gmail.com"
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
  const crc = typeof exactCRC === 'number' && !isNaN(exactCRC) && exactCRC > 0
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
      return INITIAL_JERSEYS;
    }

    // Purge legacy oversized cache (from previous 5.4MB base64 storage) to free up storage quota immediately
    if (raw.length > 200000 || raw.includes('data:image')) {
      try {
        localStorage.removeItem(KEYS.JERSEYS);
      } catch (ignore) {}
      return INITIAL_JERSEYS;
    }

    const parsed: Jersey[] = JSON.parse(raw);
    let changed = false;
    const sanitized = parsed.map(j => {
      const item = { ...j };

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

      // Clean any 100% original phrasing
      if (item.description && /original/i.test(item.description)) {
        const cleanedDesc = item.description
          .replace(/100%\s*original(es)?/gi, '100% garantizada')
          .replace(/prenda\s+f[íi]sica\s+original/gi, 'prenda física garantizada')
          .replace(/prenda\s+original/gi, 'prenda física');
        if (cleanedDesc !== item.description) {
          item.description = cleanedDesc;
          changed = true;
        }
      }

      if (!item.image || !item.image.trim()) {
        item.image = DEFAULT_JERSEY_FALLBACK_IMAGE;
        changed = true;
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
    return INITIAL_JERSEYS;
  }
}

export function saveJerseys(jerseys: Jersey[]): void {
  try {
    // Sanitize any large data URIs if uploaded manually
    const safeJerseys = jerseys.map(j => ({
      ...j,
      image: (j.image && j.image.startsWith('data:image') && j.image.length > 25000)
        ? DEFAULT_JERSEY_FALLBACK_IMAGE
        : (j.image || DEFAULT_JERSEY_FALLBACK_IMAGE),
      backImage: (j.backImage && j.backImage.startsWith('data:image') && j.backImage.length > 25000)
        ? undefined
        : j.backImage,
      images: (j.images || []).filter(img => !img.startsWith('data:image') || img.length < 15000).slice(0, 2)
    }));
    localStorage.setItem(KEYS.JERSEYS, JSON.stringify(safeJerseys));
  } catch (e) {
    try {
      // Minimal fallback to ensure core catalogue persists without hitting storage quotas
      const minimalJerseys = jerseys.map(j => ({
        id: j.id,
        name: j.name,
        team: j.team,
        league: j.league,
        price: j.price,
        priceCRC: j.priceCRC,
        discountPercent: j.discountPercent,
        stock: j.stock,
        sizesAvailable: j.sizesAvailable,
        type: j.type,
        yearSeason: j.yearSeason,
        rating: j.rating,
        reviewsCount: j.reviewsCount,
        image: j.image?.startsWith('data:') ? DEFAULT_JERSEY_FALLBACK_IMAGE : (j.image || DEFAULT_JERSEY_FALLBACK_IMAGE),
        backImage: j.backImage?.startsWith('data:') ? undefined : j.backImage
      }));
      localStorage.setItem(KEYS.JERSEYS, JSON.stringify(minimalJerseys));
    } catch (err) {
      // In-memory fallback
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
        image: item.jersey.image?.startsWith('data:image') && item.jersey.image.length > 25000
          ? DEFAULT_JERSEY_FALLBACK_IMAGE
          : (item.jersey.image || DEFAULT_JERSEY_FALLBACK_IMAGE),
        type: item.jersey.type,
        sizesAvailable: item.jersey.sizesAvailable,
        stock: item.jersey.stock,
        rating: item.jersey.rating,
        reviewsCount: item.jersey.reviewsCount
      }
    }));
    localStorage.setItem(KEYS.CART, JSON.stringify(sanitizedCart));
  } catch (e) {
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
      // In-memory fallback
    }
  }
}

/**
 * Sanitizes orders specifically for local browser storage cache to prevent quota exceeded errors.
 * Retains all critical business fields (id, customer, totals, status, items with details)
 * while pruning redundant galleries, heavy descriptions, and oversized data URIs.
 */
function sanitizeOrdersForStorage(orders: Order[], maxOrders = 25, stripAllBase64 = false): Order[] {
  if (!Array.isArray(orders)) return [];
  const list = orders.slice(0, maxOrders);

  return list.map(order => ({
    id: order.id || '',
    date: order.date || '',
    customer: {
      fullName: order.customer?.fullName || '',
      email: order.customer?.email || '',
      phone: order.customer?.phone || '',
      address: order.customer?.address || '',
      city: order.customer?.city || '',
      notes: order.customer?.notes
    },
    subtotal: order.subtotal || 0,
    discount: order.discount || 0,
    shipping: order.shipping || 0,
    total: order.total || 0,
    paymentMethod: order.paymentMethod || 'sinpe_movil',
    paymentDetails: order.paymentDetails,
    status: order.status || 'Pendiente',
    currency: order.currency || 'CRC',
    items: (order.items || []).map(it => {
      let img = it.jersey?.image || DEFAULT_JERSEY_FALLBACK_IMAGE;
      if (stripAllBase64 && img.startsWith('data:image')) {
        img = DEFAULT_JERSEY_FALLBACK_IMAGE;
      } else if (img.startsWith('data:image') && img.length > 20000) {
        img = DEFAULT_JERSEY_FALLBACK_IMAGE;
      }

      return {
        cartItemId: it.cartItemId || 'item',
        size: it.size || 'M',
        quantity: it.quantity || 1,
        customStamping: it.customStamping,
        jersey: {
          id: it.jersey?.id || '',
          name: it.jersey?.name || 'Camiseta',
          team: it.jersey?.team || '',
          league: it.jersey?.league || '',
          price: it.jersey?.price || 0,
          priceCRC: it.jersey?.priceCRC ?? it.jersey?.price ?? 0,
          image: img,
          type: it.jersey?.type || 'Local',
          yearSeason: it.jersey?.yearSeason || '2024/25',
          stock: it.jersey?.stock ?? 1,
          rating: it.jersey?.rating ?? 5,
          reviewsCount: it.jersey?.reviewsCount ?? 1,
          sizesAvailable: []
        } as Jersey
      };
    })
  }));
}

// ORDERS PERSISTENCE
export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEYS.ORDERS);
    if (!raw) {
      return [];
    }
    const parsed: Order[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // If legacy stored orders string is excessively large (> 40KB), compact it immediately to free quota
    if (raw.length > 40000 && parsed.length > 0) {
      try {
        const compacted = sanitizeOrdersForStorage(parsed, 20, true);
        localStorage.setItem(KEYS.ORDERS, JSON.stringify(compacted));
        return compacted;
      } catch (ignore) {}
    }
    return parsed;
  } catch (e) {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  try {
    const sanitized = sanitizeOrdersForStorage(orders, 25, false);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(sanitized));
  } catch (e: any) {
    try {
      const level2 = sanitizeOrdersForStorage(orders, 15, true);
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(level2));
    } catch (err2: any) {
      try {
        const level3 = sanitizeOrdersForStorage(orders, 5, true);
        localStorage.setItem(KEYS.ORDERS, JSON.stringify(level3));
      } catch (err3) {
        try {
          localStorage.removeItem(KEYS.ORDERS);
        } catch (ignore) {}
      }
    }
  }
}

// REVIEWS PERSISTENCE
export function getStoredReviews(): Review[] {
  try {
    const raw = localStorage.getItem(KEYS.REVIEWS);
    if (!raw) {
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
    // Graceful fallback
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
    // Graceful fallback
  }
}

// STORE SETTINGS PERSISTENCE
export function getStoredSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    // If settings has legacy heavy base64 featuredImage, replace with clean static path
    if (parsed.featuredImage && (parsed.featuredImage.startsWith('data:image') || parsed.featuredImage.length > 5000)) {
      parsed.featuredImage = DEFAULT_SETTINGS.featuredImage;
      try {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(parsed));
      } catch (ignore) {}
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: StoreSettings): void {
  try {
    const safeSettings = { ...settings };
    if (safeSettings.featuredImage && safeSettings.featuredImage.startsWith('data:image') && safeSettings.featuredImage.length > 50000) {
      safeSettings.featuredImage = DEFAULT_SETTINGS.featuredImage;
    }
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(safeSettings));
  } catch (e) {
    try {
      localStorage.removeItem(KEYS.ORDERS);
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (err2) {
      // Graceful fallback
    }
  }
}

// DISCOUNT CODES PERSISTENCE
export function getStoredDiscountCodes(): DiscountCode[] {
  try {
    const raw = localStorage.getItem(KEYS.DISCOUNT_CODES);
    if (!raw) {
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
    // Graceful fallback
  }
}

// BALLS / BALONES PERSISTENCE & ADAPTERS
export function getStoredBalls(): Ball[] {
  try {
    const raw = localStorage.getItem(KEYS.BALLS);
    if (!raw) {
      return INITIAL_BALLS;
    }
    const parsed: Ball[] = JSON.parse(raw);
    return parsed.map((b) => {
      const item = { ...b };
      if (!item.price || item.price < 500) {
        item.price = item.priceCRC || 25000;
      }
      item.priceCRC = item.price;
      if (!item.sizesAvailable || item.sizesAvailable.length === 0) {
        item.sizesAvailable = ['Talla 5 (Oficial)'];
      }
      return item;
    });
  } catch (e) {
    return INITIAL_BALLS;
  }
}

export function saveBalls(balls: Ball[]): void {
  try {
    localStorage.setItem(KEYS.BALLS, JSON.stringify(balls));
  } catch (e) {
    // Graceful fallback
  }
}

/**
 * Adapts a Ball into a Jersey structure for seamless integration
 * into standard cart item views, pricing engines, and checkout systems.
 */
export function ballToJerseyAdapter(ball: Ball): Jersey {
  return {
    id: ball.id,
    name: ball.name,
    team: ball.brand,
    league: (ball.tournament || 'Balones Oficiales') as any,
    sportCategory: 'Fútbol',
    price: ball.price,
    priceCRC: ball.priceCRC || ball.price,
    originalPrice: ball.originalPrice,
    originalPriceCRC: ball.originalPriceCRC,
    discountPercent: ball.discountPercent,
    yearSeason: '2024/2025',
    type: 'Edición Especial',
    version: 'Versión Jugador (Player Issue)',
    image: ball.image,
    backImage: ball.backImage,
    images: ball.images,
    sizesAvailable: (ball.sizesAvailable as any) || ['5'],
    description: ball.description,
    rating: ball.rating,
    reviewsCount: ball.reviewsCount,
    isPopular: ball.isPopular,
    isNew: ball.isNew,
    stock: ball.stock,
    badgeTags: ball.badgeTags || ['Balón Oficial', ball.brand],
    fabricInfo: ball.material
  };
}
