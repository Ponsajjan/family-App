'use client'

import Topnav from "@/components/Topnav";
import FetchFamilyTree from "./FetchFamilyTree";
import DragScroll from "@/components/DragScroll";
import { getCookie } from 'cookies-next';
import { SwitchIcon } from "@/utils/Icons";
import { useState, useEffect, useRef } from "react";
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
  // const [exporting, setExporting] = useState(false);
  // const [showExportMenu, setShowExportMenu] = useState(false);
  // const treeRef = useRef<HTMLDivElement>(null);
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

  // const exportTree = async (format: 'png' | 'pdf') => {
  //   if (!treeRef.current) return;
  //   setExporting(true);
  //   setShowExportMenu(false);
  //   try {
  //     const html2canvas = (await import('html2canvas')).default;
  //     const canvas = await html2canvas(treeRef.current, { scale: 2, useCORS: true, logging: false });
  //     if (format === 'png') {
  //       const link = document.createElement('a');
  //       link.download = 'family-tree.png';
  //       link.href = canvas.toDataURL('image/png');
  //       link.click();
  //     } else {
  //       const { jsPDF } = await import('jspdf');
  //       const imgData = canvas.toDataURL('image/png');
  //       const w = canvas.width / 2;
  //       const h = canvas.height / 2;
  //       const pdf = new jsPDF({ orientation: w > h ? 'landscape' : 'portrait', unit: 'px', format: [w, h] });
  //       pdf.addImage(imgData, 'PNG', 0, 0, w, h);
  //       pdf.save('family-tree.pdf');
  //     }
  //   } catch (err) {
  //     console.error('Export failed:', err);
  //   } finally {
  //     setExporting(false);
  //   }
  // };

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
        <div className="ml-auto flex items-center gap-2">
          {/* {data && (
            <div className="relative">
              <button
                type="button"
                disabled={exporting}
                onClick={() => setShowExportMenu(v => !v)}
                className="border border-border_color flex items-center gap-1 rounded-md px-2 py-1 text-xs cursor-pointer bg-transparent text-text_color hover:bg-field_color disabled:opacity-50"
              >
                {exporting ? 'Exporting…' : 'Export'}
              </button>
              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-[10]" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 z-[20] bg-field_color border border-border_color rounded-md shadow-md overflow-hidden text-sm">
                    <button onClick={() => exportTree('png')} className="block w-full text-left px-4 py-2 hover:bg-accent_color_hover/75 hover:text-accent_contrast text-text_color whitespace-nowrap">Download PNG</button>
                    <button onClick={() => exportTree('pdf')} className="block w-full text-left px-4 py-2 hover:bg-accent_color_hover/75 hover:text-accent_contrast text-text_color whitespace-nowrap">Download PDF</button>
                  </div>
                </>
              )}
            </div>
          )} */}
          {choosePopupAccounts.length > 1 && <button
            type="button"
            onClick={() => setShowChoosePopup(true)}
            className="border border-border_color flex items-center justify-between rounded-md px-1 py-1 cursor-pointer bg-transparent text-inherit focus:outline-none"
          >
            <SwitchIcon />
          </button>}
        </div>
      </Topnav>

      {isLoading ? (
        <div className="text-center text-text_color p-10 loading-text">Loading family tree...</div>
      ) : error ? (
        <div className="text-center text-text_color p-10">{error.message || "An error occurred"}</div>
      ) : (
        <div className="w-full md:flex">
          <DragScroll>
            {/* <div ref={treeRef}> */}
            <FetchFamilyTree data={data} onMemberClick={(id) => {
              setShowMember(id);
              setShowDetails(true);
            }} />
            {/* </div> */}
          </DragScroll>

          {/* Details Panel */}
          <SlidePanel setShowDetails={setShowDetails} showDetails={showDetails} >
            <Details showDetails={true} showMember={showMember} openDetails={setShowDetails} />
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
