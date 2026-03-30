"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./index";
import { fetchTermsData } from "./slices/termsSlice";

export function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { mainMemberName } = useSelector((state: RootState) => state.terms);

  useEffect(() => {
    if (!mainMemberName) {
      dispatch(fetchTermsData());
    }
  }, [dispatch, mainMemberName]);

  return null;
}
