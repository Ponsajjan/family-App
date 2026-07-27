import { OFFLINE_MESSAGE } from "./globalFetcher";

export const appFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  if (typeof navigator !== 'undefined' && !navigator.onLine && process.env.NODE_ENV !== 'development') {
    throw new Error(OFFLINE_MESSAGE);
  }

  let response: Response;
  try {
    response = await fetch(input, init);
  } catch (err) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new Error(OFFLINE_MESSAGE);
    }
    throw err;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    // If the service worker intercepted our API request and responded with the offline fallback HTML
    throw new Error(OFFLINE_MESSAGE);
  }

  return response;
};
