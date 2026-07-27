import { appFetch } from './appFetch';

export const globalFetcher = async (url: string) => {
  const res = await appFetch(url, {
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

  const json = await res.json();
  return json;
};
