"use client"

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./index";
import { fetchTermsData, setFamilyLastUpdates } from "./slices/termsSlice";
import { mutate } from "swr";
import { usePathname } from "next/navigation";

export function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const { mainMemberName, currentAuthId, familyLastUpdates, choosePopupAccounts } = useSelector((state: RootState) => state.terms);
  const lastCheckTime = useRef(0);

  useEffect(() => {
    if (!mainMemberName) {
      dispatch(fetchTermsData());
    }
  }, [dispatch, mainMemberName]);

  // --- Lightweight Version Check on Navigation & Focus ---
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const idsToCheck = choosePopupAccounts.length > 0
          ? choosePopupAccounts.map(a => a.authId)
          : (currentAuthId ? [currentAuthId] : []);

        if (idsToCheck.length === 0) return;

        const now = Date.now();
        if (now - lastCheckTime.current < 20000) return;
        lastCheckTime.current = now;

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
            console.log(`[AppInitializer] Global change detected on ${pathname}. Monitored accounts: ${idsToCheck.join(', ')}. Wiping cache.`);
            // Clear SWR cache
            mutate(() => true, undefined, { revalidate: true });
          }

          // Sync all new versions into store
          dispatch(setFamilyLastUpdates(serverVersions));
        }
      } catch (err) {
        console.error("[AppInitializer] Version check failed:", err);
      }
    };

    // Check version on navigation (pathname change)
    checkVersion();

    // Also check when user returns to the tab
    window.addEventListener('focus', checkVersion);

    return () => {
      window.removeEventListener('focus', checkVersion);
    };
  }, [dispatch, currentAuthId, familyLastUpdates, choosePopupAccounts, pathname]);

  return null;
}
