export const globalFetcher = async (url: string) => {
  // // 1. Prevent network request entirely if explicitly offline
  // // This avoids next-pwa's service worker returning the HTML offline fallback
  // if (typeof navigator !== 'undefined' && !navigator.onLine) {
  //   throw new Error("Offline");
  // }

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

  // Check that the Service Worker didn't intercept and return the offline HTML page
  // const contentType = res.headers.get('content-type');
  // if (contentType && contentType.includes('text/html')) {
  //   throw new Error("OfflineFallbackInterception");
  // }

  const json = await res.json();
  return json;
};
