'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInAnonymously, type User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

/**
 * A hook to manage the current user's authentication state.
 *
 * This hook handles the following:
 * 1.  Provides the current signed-in user object from Firebase Auth.
 * 2.  Automatically signs in the user anonymously if they are not already signed in.
 * 3.  Provides loading and error states for both the authentication state and
 *     the anonymous sign-in process.
 *
 * This ensures that a user session is always available, which is often a
 * prerequisite for interacting with Firebase services like Firestore, especially
 * when security rules are in place.
 *
 * @returns An object containing:
 *   - `user`: The current Firebase `User` object, or `null` if not signed in. `undefined` while loading.
 *   - `loading`: `true` if the initial authentication state is being determined.
 *   - `error`: Any error that occurred while fetching the authentication state.
 *   - `signInLoading`: `true` if the anonymous sign-in process is in progress.
 *   - `signInError`: Any error that occurred during the anonymous sign-in attempt.
 */
export function useUser() {
  const auth = useAuth();
  const [user, loading, error] = useAuthState(auth);
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    // If the initial auth state has loaded, there's no user,
    // and we're not currently trying to sign in, then sign in anonymously.
    if (!loading && !user && !signInLoading) {
        setSignInLoading(true);
        signInAnonymously(auth)
            .catch((err) => {
                setSignInError(err);
            })
            .finally(() => {
                setSignInLoading(false);
            });
    }
  }, [loading, user, signInLoading, auth]);

  return {
    user,
    loading,
    error,
    signInLoading,
    signInError,
  };
}
