'use client'

import Topnav from "@/components/Topnav";
import FetchFamilyTree from "./FetchFamilyTree";
import DragScroll from "@/components/DragScroll";
import { getCookie } from 'cookies-next';
import { SwitchIcon } from "@/utils/Icons";
import { useState, useEffect } from "react";

import { ChoosePopup } from "@/components/ChoosePopup";
import useSWR from 'swr';
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { appFetch } from "@/utils/appFetch";
import Details from "../relatives/Details";
import SlidePanel from "@/components/SlidePanel";


export default function FamilyTreePage() {
  const [showChoosePopup, setShowChoosePopup] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showMember, setShowMember] = useState<number | null>(null);
  const { choosePopupAccounts } = useSelector((state: RootState) => state.terms);
  const token = getCookie('token');
  const url = '/api/tree';
  const { data: swrResult, error, isLoading, mutate } = useSWR(token ? url : null);

  useEffect(() => {

    // Only check version if data is present on mount (from SWR cache)
    if (swrResult?._version) {
      const checkTreeVersion = async () => {
        const currentVersion = JSON.stringify(swrResult._version);
        try {
          const res = await appFetch(`/api/auth/versionCheck/tree?version=${encodeURIComponent(currentVersion)}`);
          if (res.ok) {
            const result = await res.json();
            if (result.mismatch) {
              console.log(`[VersionCheck] Stale data detected for tree. Updating...`);
              const { clearPWACaches } = await import("@/utils/pwaCache");
              await clearPWACaches();
              await mutate(result.data, false);
            }
          }
        } catch (err) {
          console.error("[Tree] Version check failed:", err);
        }
      };
      checkTreeVersion();
    }
  }, [mutate]);

  const data = swrResult?.treeData || null;

  if (!token) {
    return (
      <div className="w-full">
        <Topnav />
        <div className="text-center text-text_color m-6">Unauthorized. Please login.</div>
      </div>);
  }

  return (
    <div className="w-full">
      <Topnav>
        {choosePopupAccounts.length > 1 && <button
          type="button"
          onClick={() => setShowChoosePopup(true)}
          className="ml-auto mr-0 border border-border_color flex items-center justify-between rounded-md px-1 py-1 cursor-pointer bg-transparent text-inherit focus:outline-none"
        >
          <SwitchIcon />
        </button>}
      </Topnav>

      {isLoading ? (
        <div className="text-center text-text_color p-10 loading-text">Loading family tree...</div>
      ) : error ? (
        <div className="text-center text-text_color p-10">{error.message || "An error occurred"}</div>
      ) : (
        <div className="w-full md:flex">
          <DragScroll>
            <FetchFamilyTree data={data} onMemberClick={(id) => {
              setShowMember(id);
              setShowDetails(true);
            }} />
          </DragScroll>

          {/* Details Panel */}
          <SlidePanel setShowDetails={setShowDetails} showDetails={showDetails} >
            <Details showMember={showMember} openDetails={setShowDetails} />
          </SlidePanel>
        </div>
      )}
      {showChoosePopup && (
        <ChoosePopup
          setShowPopup={setShowChoosePopup}
          onSwitchSuccess={() => { setShowDetails(false); mutate() }} // Refresh tree data on account switch
        />
      )}
    </div>
  );
}
