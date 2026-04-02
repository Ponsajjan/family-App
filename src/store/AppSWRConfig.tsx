"use client"

import { SWRConfig } from "swr";
import { globalFetcher } from "@/utils/globalFetcher";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Stable persistent cache instance to prevent unnecessary re-initialization
 * and potential UI freezes during hydration.
 */
const cacheMap = new Map();
const timestamps = new Map();
const sessionKeys = new Set();
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
let isCacheLoaded = false;
let isIntercepted = false;

function loadCacheFromStorage() {
  if (typeof window === "undefined" || isCacheLoaded) return;
  
  try {
    const data = localStorage.getItem("app-swr-cache");
    if (!data) return;
    
    const parsedData = JSON.parse(data);
    const now = Date.now();

    parsedData.forEach((entry: any) => {
      // Check for timestamped format [key, {value, ts}] or old [key, value]
      if (entry.length === 2 && entry[1] && typeof entry[1] === "object" && entry[1].__cache_timestamp) {
        const ts = entry[1].__cache_timestamp;
        // Keep if fresh or offline
        if (now - ts < ONE_WEEK_MS || !navigator.onLine) {
          cacheMap.set(entry[0], entry[1].value);
          timestamps.set(normalizeKey(entry[0]), ts);
        }
      } else {
        cacheMap.set(entry[0], entry[1]);
        timestamps.set(normalizeKey(entry[0]), now);
      }
    });
  } catch (e) {
    console.warn("Failed to load SWR cache from localStorage", e);
  } finally {
    isCacheLoaded = true;
  }
}

const normalizeKey = (k: any) => typeof k === 'string' ? k : JSON.stringify(k);

let saveTimeout: any;
function saveToStorage() {
  if (typeof window === "undefined") return;
  if (saveTimeout) clearTimeout(saveTimeout);
  
  saveTimeout = setTimeout(() => {
    try {
      const currentNow = Date.now();
      const entriesToSave = Array.from(cacheMap.entries())
        .map(([key, value]) => [
          key, 
          { value, __cache_timestamp: timestamps.get(normalizeKey(key)) || currentNow }
        ])
        .filter((entry: any) => currentNow - entry[1].__cache_timestamp < ONE_WEEK_MS || !navigator.onLine)
        .slice(-50); // Keep only the 50 most recent valid entries

      localStorage.setItem("app-swr-cache", JSON.stringify(entriesToSave));
    } catch (e) {
      console.warn("Failed to write SWR cache to localStorage", e);
    }
  }, 1000);
}

/**
 * Singleton provider for SWR that persists exactly when needed.
 */
function localStorageProvider() {
  loadCacheFromStorage();

  // Guard: only patch the map methods once. If AppSWRConfig remounts,
  // calling bind() on an already-patched method would cause double side-effects
  // (double saves, double timestamp updates) and wrap interceptors endlessly.
  if (!isIntercepted) {
    isIntercepted = true;

    // Use Map.prototype directly so the binding is always the native implementation,
    // never the already-patched one.
    const nativeSet = Map.prototype.set.bind(cacheMap);
    const nativeGet = Map.prototype.get.bind(cacheMap);
    const nativeHas = Map.prototype.has.bind(cacheMap);
    const nativeDelete = Map.prototype.delete.bind(cacheMap);

    cacheMap.set = (key: any, value: any) => {
      const nk = normalizeKey(key);
      sessionKeys.add(nk);
      timestamps.set(nk, Date.now());
      const result = nativeSet(key, value);
      saveToStorage();
      return result;
    };

    // When online: only serve data written in the current session so SWR always
    // fetches fresh data on first mount (revalidateIfStale: false).
    // When offline: serve everything restored from localStorage.
    cacheMap.get = (key: any) => {
      if (typeof navigator !== "undefined" && !navigator.onLine) return nativeGet(key);
      const nk = normalizeKey(key);
      return sessionKeys.has(nk) ? nativeGet(key) : undefined;
    };

    // has() must mirror get() so SWR's internal state machine stays consistent:
    // it should never believe a key exists when get() would return undefined.
    cacheMap.has = (key: any) => {
      if (typeof navigator !== "undefined" && !navigator.onLine) return nativeHas(key);
      const nk = normalizeKey(key);
      return sessionKeys.has(nk) && nativeHas(key);
    };

    cacheMap.delete = (key: any) => {
      const nk = normalizeKey(key);
      sessionKeys.delete(nk);
      timestamps.delete(nk);
      const result = nativeDelete(key);
      saveToStorage();
      return result;
    };
  }

  return cacheMap;
}

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
            logout();
          }
        }
      }}
    >
      {children}
    </SWRConfig>
  );
}
