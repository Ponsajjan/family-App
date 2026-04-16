"use client"

import { useCallback } from "react";
import { useSelector } from "react-redux";
import { mutate } from "swr";
import { RootState } from "../store";
import { appFetch } from "@/utils/appFetch";

// let globalLastCheckTime = 0;

export function useVersionCheck() {
    const { currentAuthId, choosePopupAccounts } = useSelector((state: RootState) => state.terms);

    const checkVersion = useCallback(async (url: any) => {
        try {
            const idsToCheck = choosePopupAccounts.length > 0
                ? choosePopupAccounts.map(a => a.authId)
                : (currentAuthId ? [currentAuthId] : []);

            if (idsToCheck.length === 0) return;

            // const now = Date.now();
            // // Throttle to 5 seconds unless forced
            // if (!force && now - globalLastCheckTime < 5000) return;
            // globalLastCheckTime = now;

            const res = await appFetch(`/api/auth/version?ids=${idsToCheck.join(',')}`);
            if (!res.ok) return;

            const { updatedAt: serverVersions } = await res.json();

            let needsWipe = false;

            // Try to extract the exact cached header for this URL if possible
            let cachedVersions: Record<string, number> | null = null;
            if (typeof url === 'string' && typeof window !== 'undefined' && 'caches' in window) {
                try {
                    const cachedRes = await caches.match(url);
                    const headerData = cachedRes?.headers.get('X-Family-Last-Update');
                    if (headerData) {
                        try {
                            cachedVersions = JSON.parse(headerData);
                        } catch {
                            if (currentAuthId) {
                                cachedVersions = { [currentAuthId]: parseInt(headerData, 10) };
                            }
                        }
                    }
                } catch (e) {
                    console.error("Error reading cache for version check", e);
                }
            }

            // Find if any account version has changed
            idsToCheck.forEach(id => {
                const serverVersion = serverVersions[id] || 0;
                // Prefer exact URL cache timestamp if available, fallback to global Redux state
                const clientVersion = (cachedVersions && cachedVersions[id]) || 0;

                if (clientVersion === 0 && serverVersion > 0) {
                    needsWipe = false;
                } else if (serverVersion > clientVersion) {
                    needsWipe = true;
                }
            });

            if (needsWipe) {
                console.log(`[VersionCheck] Cache wipe triggered. Accounts: ${idsToCheck.join(', ')}`);

                // 2. Clear targeted PWA (Service Worker) caches
                if (typeof window !== 'undefined' && 'caches' in window) {
                    try {
                        const cacheNames = await caches.keys();
                        const targetCaches = ['apis', 'next-data'];

                        await Promise.all(
                            cacheNames
                                .filter((name) => targetCaches.some((target) => name.includes(target)))
                                .map((name) => caches.delete(name))
                        );
                        console.log("[VersionCheck] Successfully destroyed targeted PWA caches.");
                    } catch (err) {
                        console.error("[VersionCheck] Failed to clear PWA cache:", err);
                    }
                }

                // Wipe all SWR cache
                await mutate(url, undefined, { revalidate: true });
                console.log("[VersionCheck] Successfully wiped SWR cache.");
            }

        } catch (err) {
            console.error("[useVersionCheck] failed:", err);
        }
    }, [currentAuthId, choosePopupAccounts]);

    return { checkVersion };
}