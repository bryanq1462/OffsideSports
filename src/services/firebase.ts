import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Jersey, StoreSettings, Order, DiscountCode, Review } from '../types';
import { INITIAL_JERSEYS, INITIAL_REVIEWS } from '../data/mockData';
import { DEFAULT_SETTINGS, DEFAULT_DISCOUNT_CODES } from '../utils/storage';

// Initialize Firebase app singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with custom databaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Error Handling Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: Array<{
      providerId: string;
      email?: string | null;
    }>;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Clean data before sending to Firestore (removes undefined values which Firestore strictly rejects)
export function cleanForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => (typeof item === 'object' && item !== null ? cleanForFirestore(item) : item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        continue;
      }
      if (value !== null && typeof value === 'object') {
        cleaned[key] = cleanForFirestore(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned as T;
  }
  return data;
}

// Connection Validation as required by guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline or connecting...');
    }
  }
}
testConnection();

// ==========================================
// REAL-TIME CLOUD CATALOG (JERSEYS)
// ==========================================

let isInitialJerseysSeeded = false;

export function subscribeToJerseys(callback: (jerseys: Jersey[]) => void): () => void {
  const path = 'jerseys';
  const jerseysRef = collection(db, path);

  const unsubscribe = onSnapshot(
    jerseysRef,
    async (snapshot) => {
      // If collection is completely empty in Firestore, automatically seed initial catalog
      if (snapshot.empty && !isInitialJerseysSeeded) {
        isInitialJerseysSeeded = true;
        try {
          const batch = writeBatch(db);
          INITIAL_JERSEYS.forEach((jersey) => {
            const jDoc = doc(db, 'jerseys', jersey.id);
            batch.set(jDoc, jersey);
          });
          await batch.commit();
          callback(INITIAL_JERSEYS);
          return;
        } catch (e) {
          console.warn('Could not auto-seed jerseys in batch, using mock data:', e);
          callback(INITIAL_JERSEYS);
          return;
        }
      }

      if (!snapshot.empty) {
        const cloudJerseys: Jersey[] = [];
        snapshot.forEach((docSnap) => {
          cloudJerseys.push(docSnap.data() as Jersey);
        });
        callback(cloudJerseys);
      }
    },
    (error) => {
      console.warn('Firestore jerseys onSnapshot error, falling back to local state:', error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}

export async function saveJerseyToCloud(jersey: Jersey): Promise<void> {
  const path = `jerseys/${jersey.id}`;
  try {
    const cleaned = cleanForFirestore(jersey);
    const jerseyDoc = doc(db, 'jerseys', jersey.id);
    await setDoc(jerseyDoc, cleaned, { merge: true });
    console.log(`[Firestore] Successfully saved jersey: ${jersey.id}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteJerseyFromCloud(jerseyId: string): Promise<void> {
  const path = `jerseys/${jerseyId}`;
  try {
    const jerseyDoc = doc(db, 'jerseys', jerseyId);
    await deleteDoc(jerseyDoc);
    console.log(`[Firestore] Successfully deleted jersey: ${jerseyId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncAllJerseysToCloud(jerseys: Jersey[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    jerseys.forEach((jersey) => {
      const cleaned = cleanForFirestore(jersey);
      const jDoc = doc(db, 'jerseys', jersey.id);
      batch.set(jDoc, cleaned, { merge: true });
    });
    await batch.commit();
    console.log(`[Firestore] Successfully synced ${jerseys.length} jerseys`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'jerseys');
  }
}

// ==========================================
// REAL-TIME STORE SETTINGS (CONTACT, SINPE, FEES)
// ==========================================

export function subscribeToSettings(callback: (settings: StoreSettings) => void): () => void {
  const path = 'settings/store';
  const settingsDocRef = doc(db, 'settings', 'store');

  const unsubscribe = onSnapshot(
    settingsDocRef,
    async (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as StoreSettings);
      } else {
        // Seed default store settings if not yet set in Firestore
        try {
          const cleanedDefault = cleanForFirestore(DEFAULT_SETTINGS);
          await setDoc(settingsDocRef, cleanedDefault, { merge: true });
          callback(DEFAULT_SETTINGS);
        } catch (e) {
          callback(DEFAULT_SETTINGS);
        }
      }
    },
    (error) => {
      console.warn('Firestore settings onSnapshot error:', error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );

  return unsubscribe;
}

export async function saveSettingsToCloud(settings: StoreSettings): Promise<void> {
  const path = 'settings/store';
  try {
    const cleaned = cleanForFirestore(settings);
    const settingsDocRef = doc(db, 'settings', 'store');
    await setDoc(settingsDocRef, cleaned, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ==========================================
// REAL-TIME CUSTOMER ORDERS
// ==========================================

export function subscribeToOrders(callback: (orders: Order[]) => void): () => void {
  const path = 'orders';
  const ordersRef = collection(db, path);

  const unsubscribe = onSnapshot(
    ordersRef,
    (snapshot) => {
      const ordersList: Order[] = [];
      snapshot.forEach((docSnap) => {
        ordersList.push(docSnap.data() as Order);
      });
      // Sort newest first
      ordersList.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      callback(ordersList);
    },
    (error) => {
      console.warn('Firestore orders onSnapshot error:', error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}

export async function saveOrderToCloud(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    const cleaned = cleanForFirestore(order);
    const orderDocRef = doc(db, 'orders', order.id);
    await setDoc(orderDocRef, cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderStatusInCloud(orderId: string, status: Order['status']): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await setDoc(orderDocRef, { status }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ==========================================
// DISCOUNT CODES
// ==========================================

export function subscribeToDiscountCodes(callback: (codes: DiscountCode[]) => void): () => void {
  const path = 'discounts';
  const discountsRef = collection(db, path);

  const unsubscribe = onSnapshot(
    discountsRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          DEFAULT_DISCOUNT_CODES.forEach((code) => {
            const cleaned = cleanForFirestore(code);
            const dDoc = doc(db, 'discounts', code.id);
            batch.set(dDoc, cleaned);
          });
          await batch.commit();
          callback(DEFAULT_DISCOUNT_CODES);
          return;
        } catch (e) {
          callback(DEFAULT_DISCOUNT_CODES);
          return;
        }
      }

      const codesList: DiscountCode[] = [];
      snapshot.forEach((docSnap) => {
        codesList.push(docSnap.data() as DiscountCode);
      });
      callback(codesList);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}

export async function saveDiscountCodesToCloud(codes: DiscountCode[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    codes.forEach((code) => {
      const cleaned = cleanForFirestore(code);
      const dDoc = doc(db, 'discounts', code.id);
      batch.set(dDoc, cleaned, { merge: true });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'discounts');
  }
}

// ==========================================
// REVIEWS
// ==========================================

export function subscribeToReviews(callback: (reviews: Review[]) => void): () => void {
  const path = 'reviews';
  const reviewsRef = collection(db, path);

  const unsubscribe = onSnapshot(
    reviewsRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_REVIEWS.forEach((rev) => {
            const cleaned = cleanForFirestore(rev);
            const rDoc = doc(db, 'reviews', rev.id);
            batch.set(rDoc, cleaned);
          });
          await batch.commit();
          callback(INITIAL_REVIEWS);
          return;
        } catch (e) {
          callback(INITIAL_REVIEWS);
          return;
        }
      }

      const reviewsList: Review[] = [];
      snapshot.forEach((docSnap) => {
        reviewsList.push(docSnap.data() as Review);
      });
      reviewsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(reviewsList);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );

  return unsubscribe;
}

export async function saveReviewToCloud(review: Review): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    const cleaned = cleanForFirestore(review);
    const rDoc = doc(db, 'reviews', review.id);
    await setDoc(rDoc, cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
