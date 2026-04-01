export const appFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error("No internet connection. Retry when you are back online");
  }

  const response = await fetch(input, init);

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    // If the service worker intercepted our API request and responded with the offline fallback HTML
    throw new Error("No internet connection. Retry when you are back online");
  }

  return response;
};
