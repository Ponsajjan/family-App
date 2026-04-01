import { store } from '@/store';
import { setFamilyLastUpdates } from '@/store/slices/termsSlice';
import { mutate } from 'swr';

/**
 * Global SWR fetcher that implements "Cache Busting via Data Versioning".
 * It compares the server-provided `X-Family-Last-Update` header with the
 * timestamp stored in Redux. If the server is newer, it wipes the SWR cache.
 */
export const globalFetcher = async (url: string) => {
  // 1. Prevent network request entirely if explicitly offline
  // This avoids next-pwa's service worker returning the HTML offline fallback
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error("Offline");
  }

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

  // 2. Double check that the Service Worker didn't intercept and return the offline HTML page
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    throw new Error("OfflineFallbackInterception");
  }

  // 1. Get current authId from Redux
  const state = store.getState();
  const currentAuthId = state.terms.currentAuthId;

  // 2. Read the server's last update header
  const serverUpdateHeader = res.headers.get('X-Family-Last-Update');

  if (serverUpdateHeader) {
    let serverVersions: Record<string, number> = {};
    try {
      serverVersions = JSON.parse(serverUpdateHeader);
    } catch {
      // Fallback for legacy single-value header
      if (currentAuthId) serverVersions[currentAuthId] = parseInt(serverUpdateHeader, 10);
    }

    let needsWipe = false;

    // Check all server versions against client versions
    Object.entries(serverVersions).forEach(([authId, serverTs]) => {
      const clientTs = state.terms.familyLastUpdates[authId] || 0;
      if (clientTs > 0 && serverTs > clientTs) {
        needsWipe = true;
      }
    });

    if (needsWipe) {
      console.log(`[CacheBuster] Global update detected. Clearing SWR cache.`);
      mutate(() => true, undefined, { revalidate: true });
    }

    // sync ALL new versions into Redux
    store.dispatch(setFamilyLastUpdates(serverVersions));
  }

  return res.json();
};
