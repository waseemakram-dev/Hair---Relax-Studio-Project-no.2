'use client';
import type { CollectionReference, Query, DocumentData } from 'firebase/firestore';
import { useCollection as useReactFirebaseCollection } from 'react-firebase-hooks/firestore';

/**
 * A hook for fetching and listening to a Firestore collection in real-time.
 *
 * This hook simplifies the process of subscribing to a collection and automatically
 * handles updates, loading states, and errors. It's a wrapper around the
 * `useCollection` hook from `react-firebase-hooks/firestore` but specifically
 * tailored for this application's architecture.
 *
 * @param query The Firestore `CollectionReference` or `Query` to listen to.
 *              It's crucial to memoize this query with `useMemo` if it's
 *              constructed dynamically within a component to prevent re-renders
 *              from causing infinite loops.
 * @returns An object containing:
 *  - `data`: An array of document data from the collection, typed as `T[]`. `undefined` while loading.
 *  - `loading`: A boolean indicating if the data is currently being fetched.
 *  - `error`: Any error that occurred during the fetch.
 */
export function useCollection<T extends DocumentData>(query: CollectionReference<T> | Query<T> | null) {
  const [snapshot, loading, error] = useReactFirebaseCollection(query, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const data = snapshot?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[] | undefined;

  return { data, loading, error };
}
