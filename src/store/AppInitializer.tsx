"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./index";
import { fetchTermsData } from "./slices/termsSlice";

export function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  // Only fetch if data hasn't been loaded yet (mainMemberName is empty = not fetched)
  const mainMemberName = useSelector((state: RootState) => state.terms.mainMemberName);

  useEffect(() => {
    if (!mainMemberName) {
      dispatch(fetchTermsData());
    }
  }, [dispatch, mainMemberName]);

  return null;
}
