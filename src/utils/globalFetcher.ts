import { OFFLINE_MESSAGE } from "./appFetch";

export const globalFetcher = async (url: string) => {

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const contentType = res.headers.get('content-type');
    const errorData = await res.json().catch(() => ({}));
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error(OFFLINE_MESSAGE);
    } else if (contentType && contentType.includes('text/html')) {
      // Check that the Service Worker didn't intercept and return the offline HTML page
      throw new Error(OFFLINE_MESSAGE);
    } else {
      throw new Error(errorData.error || "Failed to fetch data");
    }
  }

  const json = await res.json();
  return json;
};
