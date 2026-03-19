"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./index";
import { fetchTermsData, setFamilyLastUpdate } from "./slices/termsSlice";
import { mutate } from "swr";
import { usePathname } from "next/navigation";

export function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const { mainMemberName, currentAuthId, familyLastUpdates } = useSelector((state: RootState) => state.terms);

  useEffect(() => {
    if (!mainMemberName) {
      dispatch(fetchTermsData());
    }
  }, [dispatch, mainMemberName]);

  // --- Lightweight Version Check on Navigation & Focus ---
  useEffect(() => {
    if (!currentAuthId) return;

    const checkVersion = async () => {
      try {
        const res = await fetch('/api/auth/version');
        if (!res.ok) return;
        
        const { updatedAt: serverVersion } = await res.json();
        const clientVersion = familyLastUpdates[currentAuthId] || 0;

        if (clientVersion === 0) {
          // Initialize first version of the session
          dispatch(setFamilyLastUpdate({ authId: currentAuthId, timestamp: serverVersion }));
        } else if (serverVersion > clientVersion) {
          console.log(`[AppInitializer] Global change detected on ${pathname} (${serverVersion} > ${clientVersion}). Wiping cache.`);
          
          // Clear SWR cache
          mutate(() => true, undefined, { revalidate: true });
          
          // Sync new version
          dispatch(setFamilyLastUpdate({ authId: currentAuthId, timestamp: serverVersion }));
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
  }, [dispatch, currentAuthId, familyLastUpdates, pathname]);

  return null;
}
