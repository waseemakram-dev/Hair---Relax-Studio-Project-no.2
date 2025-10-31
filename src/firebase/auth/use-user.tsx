'use client';

import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInAnonymously, type User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';
import { usePathname, useRouter } from 'next/navigation';

/**
 * A hook to manage the current user's authentication state.
 *
 * This hook handles the following:
 * 1.  Provides the current signed-in user object from Firebase Auth.
 * 2.  Automatically signs in the user anonymously if they are not already signed in on public pages.
 * 3.  Redirects to the login page if the user is not authenticated on a protected page.
 * 4.  Provides loading and error states.
 *
 * @returns An object containing:
 *   - `user`: The current Firebase `User` object, or `null` if not signed in. `undefined` while loading.
 *   - `loading`: `true` if the initial authentication state is being determined.
 *   - `error`: Any error that occurred while fetching the authentication state.
 */
export function useUser() {
  const auth = useAuth();
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isProtectedPage = !isAuthPage && pathname !== '/';

  useEffect(() => {
    if (!loading) {
      if (user && isAuthPage) {
        // If user is logged in and tries to access login/signup, redirect to dashboard
        router.replace('/dashboard');
      } else if (!user && isProtectedPage) {
        // If user is not logged in and tries to access a protected page, redirect to login
        router.replace('/login');
      }
    }
  }, [user, loading, isAuthPage, isProtectedPage, router]);

  return {
    user,
    loading,
    error,
  };
}
