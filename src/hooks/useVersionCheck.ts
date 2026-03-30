"use client"

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mutate } from "swr";
import { RootState } from "../store";
import { setFamilyLastUpdates } from "../store/slices/termsSlice";

let globalLastCheckTime = 0;

export function useVersionCheck() {
    const dispatch = useDispatch();
    const { currentAuthId, familyLastUpdates, choosePopupAccounts } = useSelector((state: RootState) => state.terms);

    const checkVersion = useCallback(async (force = false) => {
        try {
            const idsToCheck = choosePopupAccounts.length > 0
                ? choosePopupAccounts.map(a => a.authId)
                : (currentAuthId ? [currentAuthId] : []);

            if (idsToCheck.length === 0) return;

            const now = Date.now();
            // Throttle to 20 seconds unless forced
            if (!force && now - globalLastCheckTime < 10000) return;
            globalLastCheckTime = now;

            const res = await fetch(`/api/auth/version?ids=${idsToCheck.join(',')}`);
            if (!res.ok) return;

            const { updatedAt: serverVersions } = await res.json();

            let needsWipe = false;
            let isFirstSync = false;

            // Find if any account version has changed
            idsToCheck.forEach(id => {
                const serverVersion = serverVersions[id] || 0;
                const clientVersion = familyLastUpdates[id] || 0;

                if (clientVersion === 0 && serverVersion > 0) {
                    isFirstSync = true;
                } else if (serverVersion > clientVersion) {
                    needsWipe = true;
                }
            });

            if (needsWipe || (isFirstSync && Object.keys(serverVersions).length > 0)) {
                if (needsWipe) {
                    console.log(`[VersionCheck] Cache wipe triggered. Accounts: ${idsToCheck.join(', ')}`);
                    // Wipe all SWR cache
                    mutate(() => true, undefined, { revalidate: true });
                }

                // Sync all new versions into store
                dispatch(setFamilyLastUpdates(serverVersions));
            }
        } catch (err) {
            console.error("[useVersionCheck] failed:", err);
        }
    }, [dispatch, currentAuthId, familyLastUpdates, choosePopupAccounts]);

    return { checkVersion };
}
