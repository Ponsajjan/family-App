export const OFFLINE_MESSAGE = "No internet connection. Retry when you are back online";

export const globalFetcher = async (url: string) => {

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error(OFFLINE_MESSAGE);
    }
    throw err;
  }

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const contentType = res.headers.get('content-type');

    // Offline, or the Service Worker intercepted and returned the offline HTML page
    if ((typeof navigator !== 'undefined' && !navigator.onLine) || (contentType && contentType.includes('text/html'))) {
      throw new Error(OFFLINE_MESSAGE);
    }
    throw new Error(errorData.error || "Failed to fetch data");
  }

  const json = await res.json();
  return json;
};
