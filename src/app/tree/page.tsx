'use client'

import Topnav from "@/components/Topnav";
import FetchFamilyTree from "./FetchFamilyTree";
import DragScroll from "@/components/DragScroll";
import { getCookie } from 'cookies-next';
import { SwitchIcon } from "@/utils/Icons";
import { useState } from "react";
import { ChoosePopup } from "@/components/ChoosePopup";
import { useAuth } from "@/contexts/AuthContext";
import useSWR from 'swr';
import { useSelector } from "react-redux";
import { RootState } from "@/store";


export default function FamilyTreePage() {
  const [showChoosePopup, setShowChoosePopup] = useState(false);
  const token = getCookie('token');
  const { choosePopupAccounts } = useSelector((state: RootState) => state.terms);

  const { data: swrResult, error, isLoading, mutate } = useSWR(
    token ? '/api/tree' : null
  );

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
        {choosePopupAccounts.length > 1 && <div
          onClick={() => setShowChoosePopup(true)}
          className="ml-auto mr-0 border border-border_color flex items-center justify-between rounded-md px-1 py-1 cursor-pointer"
        >
          <SwitchIcon />
        </div>}
      </Topnav>

      {isLoading ? (
        <div className="text-center text-text_color p-10 loading-text">Loading family tree...</div>
      ) : error ? (
        <div className="text-center text-text_color p-10">{error.message || "An error occurred"}</div>
      ) : (
        <DragScroll>
          <FetchFamilyTree data={data} />
        </DragScroll>
      )}

      {showChoosePopup && (
        <ChoosePopup
          showPopup={showChoosePopup}
          setShowPopup={setShowChoosePopup}
          onSwitchSuccess={() => mutate()} // Refresh tree data on account switch
        />
      )}
    </div>
  );
}
