'use client';
import { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Define the context shape
interface FirebaseContextType {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

// Create the context
const FirebaseContext = createContext<FirebaseContextType>({
  firebaseApp: null,
  auth: null,
  firestore: null,
});

// Custom hook to access the Firebase context
export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};

export const useFirebaseApp = () => {
    const { firebaseApp } = useFirebase();
    if (!firebaseApp) {
        throw new Error('Firebase App has not been provided');
    }
    return firebaseApp;
}

export const useAuth = () => {
    const { auth } = useFirebase();
    if (!auth) {
        throw new Error('Firebase Auth has not been provided');
    }
    return auth;
}

export const useFirestore = () => {
    const { firestore } = useFirebase();
    if (!firestore) {
        throw new Error('Firestore has not been provided');
    }
    return firestore;
}


// Provider component
export function FirebaseProvider({
  children,
  firebaseApp,
  auth,
  firestore,
}: {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  const value = useMemo(
    () => ({
      firebaseApp,
      auth,
      firestore,
    }),
    [firebaseApp, auth, firestore]
  );

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}
