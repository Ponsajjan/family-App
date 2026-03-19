"use client"

import { SWRConfig } from "swr";
import { globalFetcher } from "@/utils/globalFetcher";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Global wrapper for SWRConfig that provides:
 * 1. The custom version-aware `globalFetcher`.
 * 2. Standardized stale-while-revalidate behavior.
 * 3. Automatic global logout on 401 Unauthorized status.
 */
export function AppSWRConfig({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();

  return (
    <SWRConfig
      value={{
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
