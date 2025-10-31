'use client';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

/**
 * Initializes Firebase on the client-side and provides it to its children.
 *
 * This component ensures that Firebase is initialized only once, right when it's
 * needed on the client. It wraps the standard `FirebaseProvider` to pass down
 * the initialized `firebaseApp`, `auth`, and `firestore` instances.
 *
 * Using this provider at the root of your client-side component tree (e.g., in a layout)
 * makes Firebase services available to all child components via the `useFirebase`,
 * `useAuth`, and `useFirestore` hooks.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Memoize the initialization to prevent re-running on every render.
  const { firebaseApp, auth, firestore } = initializeFirebase();

  return (
    <FirebaseProvider firebaseApp={firebaseApp} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
