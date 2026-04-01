"use client"

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./index";
import { fetchTermsData, hydrateTermsFromCache } from "./slices/termsSlice";

export function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { mainMemberName } = useSelector((state: RootState) => state.terms);
  const initialized = useRef(false);

  useEffect(() => {
    // Only fetch/hydrate once per session load to avoid infinite loops
    if (!initialized.current && !mainMemberName) {
      initialized.current = true;
      
      // 1. Instantly load stale data from localStorage ONLY if Offline
      if (typeof window !== "undefined" && !navigator.onLine) {
        try {
          const cachedTerms = localStorage.getItem("redux-terms-cache");
          if (cachedTerms) {
            dispatch(hydrateTermsFromCache(JSON.parse(cachedTerms)));
          }
        } catch (e) {
          console.warn("Failed to parse cached generic terms.", e);
        }
      }

      // 2. Fetch from the network logically 
      // (If offline, this might fail, but SWR/Next.js Service Worker may intercept it. 
      // Redux will safely just retain the offline hydration).
      dispatch(fetchTermsData());
    }
  }, [dispatch, mainMemberName]);

  return null;
}
