import { store } from '@/store';
import { setFamilyLastUpdate } from '@/store/slices/termsSlice';
import { mutate } from 'swr';

/**
 * Global SWR fetcher that implements "Cache Busting via Data Versioning".
 * It compares the server-provided `X-Family-Last-Update` header with the
 * timestamp stored in Redux. If the server is newer, it wipes the SWR cache.
 */
export const globalFetcher = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch data");
  }

  // 1. Get current authId from Redux
  const state = store.getState();
  const currentAuthId = state.terms.currentAuthId;

  // 2. Read the server's last update header
  const serverUpdateHeader = res.headers.get('X-Family-Last-Update');
  console.log('----------------', serverUpdateHeader, currentAuthId, '---------------');
  if (serverUpdateHeader && currentAuthId) {
    const serverTimestamp = parseInt(serverUpdateHeader, 10);
    const clientTimestamp = state.terms.familyLastUpdates[currentAuthId] || 0;

    // 3. Comparison Logic
    if (clientTimestamp === 0) {
      // First fetch of the session for this account: just sync the timestamp
      store.dispatch(setFamilyLastUpdate({
        authId: currentAuthId,
        timestamp: serverTimestamp
      }));
    } else if (serverTimestamp > clientTimestamp) {
      // Data change detected: wipe cache and update
      console.log(`[CacheBuster] Server version (${serverTimestamp}) is newer than client version (${clientTimestamp}). Clearing SWR cache.`);
      
      mutate(() => true, undefined, { revalidate: true });

      store.dispatch(setFamilyLastUpdate({
        authId: currentAuthId,
        timestamp: serverTimestamp
      }));
    }
  }

  return res.json();
};
