import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';

import { firebaseConfig } from './config';

// Exports a memoized function that returns an object containing the Firebase App, Auth, and Firestore instances.
// This prevents re-initialization on every render.
export const initializeFirebase = (() => {
  let firebaseApp: FirebaseApp;
  let auth: Auth;
  let firestore: Firestore;
  let persistenceEnabled = false;

  return () => {
    if (!firebaseApp) {
      if (getApps().length === 0) {
        firebaseApp = initializeApp(firebaseConfig);
      } else {
        firebaseApp = getApp();
      }
      auth = getAuth(firebaseApp);
      firestore = getFirestore(firebaseApp);

      if (!persistenceEnabled) {
        enableIndexedDbPersistence(firestore).catch((err) => {
          if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time.
            console.warn('Firestore persistence failed: Multiple tabs open.');
          } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            console.warn('Firestore persistence not available in this browser.');
          }
        });
        persistenceEnabled = true;
      }
    }
    return { firebaseApp, auth, firestore };
  };
})();

export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
