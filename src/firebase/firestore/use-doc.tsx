'use client';
import type { DocumentReference, DocumentData } from 'firebase/firestore';
import { useDocument as useReactFirebaseDocument } from 'react-firebase-hooks/firestore';

/**
 * A hook for fetching and listening to a single Firestore document in real-time.
 *
 * This hook simplifies subscribing to a document and handles updates, loading, and errors.
 * It's a wrapper around `useDocument` from `react-firebase-hooks/firestore`.
 *
 * @param ref The Firestore `DocumentReference` to listen to. Memoize this with `useMemo`
 *            if it's constructed dynamically to avoid infinite re-renders.
 * @returns An object containing:
 *  - `data`: The document's data, typed as `T`. `undefined` while loading.
 *  - `loading`: A boolean indicating if the data is currently being fetched.
 *  - `error`: Any error that occurred during the fetch.
 */
export function useDoc<T extends DocumentData>(ref: DocumentReference<T> | null) {
  const [snapshot, loading, error] = useReactFirebaseDocument(ref, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  const data = snapshot?.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as T)
    : undefined;

  return { data, loading, error };
}
