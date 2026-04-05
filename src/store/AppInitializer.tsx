"use client"

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./index";
import { fetchTermsData } from "./slices/termsSlice";

export function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { mainMemberName } = useSelector((state: RootState) => state.terms);

  useEffect(() => {
    // Only fetch once per session load to avoid infinite loops
    if (!mainMemberName) {
      dispatch(fetchTermsData());
    }
  }, [dispatch, mainMemberName]);

  return null;
}
