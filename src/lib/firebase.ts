import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Authentication status promise with 10s timeout
export const authReady = new Promise<User | null>((resolve) => {
  const timeout = setTimeout(() => {
    console.warn("Auth check timed out, proceeding as unauthenticated");
    resolve(null);
  }, 10000);

  // Try to sign in anonymously if not already signed in
  signInAnonymously(auth)
    .then((credential) => {
      clearTimeout(timeout);
      console.log("Firebase Auth State: Authenticated as", credential.user.uid);
      resolve(credential.user);
    })
    .catch((err) => {
      console.warn('Anonymous auth failed:', err);
      // Fallback
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        clearTimeout(timeout);
        resolve(user);
        unsubscribe();
      });
    });
});

// Test connection and log errors
export async function testFirebaseConnection() {
  try {
    // Wait for auth first
    await authReady;
    await getDocFromServer(doc(db, 'test-connection', 'status'));
    console.log("Firebase connected successfully");
    return true;
  } catch (error: any) {
    console.error("Firebase connection test failed:", error);
    return false;
  }
}
testFirebaseConnection();

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
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
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
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
