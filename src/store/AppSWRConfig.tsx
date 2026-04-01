"use client"

import { SWRConfig } from "swr";
import { globalFetcher } from "@/utils/globalFetcher";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Creates a Map provider that persists the SWR cache to localStorage.
 * This ensures that if the app is closed or reloaded while offline,
 * the previously fetched (cashed) data is immediately available.
 */
function localStorageProvider() {
  if (typeof window === "undefined") {
    return new Map();
  }

  const timestamps = new Map<any, number>();
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  let initialEntries: [any, any][] = [];
  try {
    const data = localStorage.getItem("app-swr-cache");
    const parsedData = data ? JSON.parse(data) : [];
    
    // Parse the stored data to extract values and timestamps
    parsedData.forEach((entry: any) => {
      if (entry.length === 2 && entry[1] && typeof entry[1] === "object" && entry[1].__cache_timestamp) {
        // New timestamped format: Keep only if it is younger than 1 week!
        const ts = entry[1].__cache_timestamp;
        // Keep if younger than 1 week OR if user is offline (preserve data during disconnection)
        if (now - ts < ONE_WEEK_MS || !navigator.onLine) {
          timestamps.set(entry[0], ts);
          initialEntries.push([entry[0], entry[1].value]);
        }
      } else {
        // Old format compatibility (from before we added timestamps): Assign current time
        timestamps.set(entry[0], now);
        initialEntries.push(entry);
      }
    });
  } catch (e) {
    initialEntries = [];
  }

  const map = new Map<any, any>(initialEntries);

  // Core saving logic. Fully analog: executes exactly when SWR data fundamentally changes.
  function saveToStorage() {
    try {
      const currentNow = Date.now();
      
      // Filter out stale entries (TTL > 1 week) & wrap them with their timestamp
      let entriesToSave = Array.from(map.entries())
        .map(([key, value]) => [
          key, 
          { value, __cache_timestamp: timestamps.get(key) || currentNow }
        ])
        .filter((entry: any) => currentNow - entry[1].__cache_timestamp < ONE_WEEK_MS || !navigator.onLine);

      // Prevent localStorage from getting full by keeping only the 50 most recent valid entries
      if (entriesToSave.length > 50) {
        entriesToSave = entriesToSave.slice(entriesToSave.length - 50);
      }
      
      const appCache = JSON.stringify(entriesToSave);
      localStorage.setItem("app-swr-cache", appCache);
    } catch (e) {
      console.warn("Failed to write to localStorage (might be full)", e);
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        localStorage.removeItem("app-swr-cache");
      }
    }
  }

  // Track which endpoints have been natively fetched during THIS active session
  const sessionKeys = new Set<string>();

  const normalizeKey = (k: any) => typeof k === 'string' ? k : JSON.stringify(k);

  // Intercept map operations to maintain accurate timestamps whenever SWR fetches new data
  const originalSet = map.set.bind(map);
  map.set = function (key: any, value: any) {
    const nk = normalizeKey(key);
    sessionKeys.add(nk); // Mark as alive in current session
    timestamps.set(nk, Date.now()); // Mark data as fresh!
    const result = originalSet(key, value);
    saveToStorage(); // Save exactly when API data is written
    return result;
  };

  const originalGet = map.get.bind(map);
  map.get = function (key: any) {
    // If the user's connection drops, we permit reading ALL historical cache
    if (!navigator.onLine) {
      return originalGet(key);
    }
    // If online, ONLY permit reading data if it was explicitly freshly fetched this session
    const nk = normalizeKey(key);
    if (sessionKeys.has(nk)) {
      return originalGet(key);
    }
    // Otherwise, actively hide the old cache from SWR so it waits for the fresh network response!
    return undefined;
  };
  
  const originalDelete = map.delete.bind(map);
  map.delete = function (key: any) {
    const nk = normalizeKey(key);
    sessionKeys.delete(nk);
    timestamps.delete(nk);
    const result = originalDelete(key);
    saveToStorage(); 
    return result;
  };

  const originalClear = map.clear.bind(map);
  map.clear = function () {
    timestamps.clear();
    originalClear();
    saveToStorage(); 
  };

  return map;
}

/**
 * Global wrapper for SWRConfig that provides:
 * 1. The custom version-aware `globalFetcher`.
 * 2. Standardized stale-while-revalidate behavior.
 * 3. Automatic global logout on 401 Unauthorized status.
 * 4. PWA Offline Cache persistence via localStorageProvider.
 */
export function AppSWRConfig({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();

  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        fetcher: globalFetcher,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        onError: (err) => {
          if (err.message === "Unauthorized") {
            console.warn("[AppSWRConfig] 401 Unauthorized detected. Logging out...");
            logout();
          }
        }
      }}
    >
      {children}
    </SWRConfig>
  );
}
