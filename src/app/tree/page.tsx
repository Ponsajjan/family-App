'use client'

import Topnav from "@/components/Topnav";
import FetchFamilyTree from "./FetchFamilyTree";
import DragScroll from "@/components/DragScroll";
import { getCookie } from 'cookies-next';
import { SwitchIcon } from "@/utils/Icons";
import { useState } from "react";
import { ChoosePopup } from "@/components/ChoosePopup";

export default function FamilyTreePage() {
  const [showChoosePopup, setShowChoosePopup] = useState(false)
  const token = getCookie('token');

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
        <div
          onClick={() => setShowChoosePopup(true)}
          className="ml-auto mr-0 border border-border_color flex items-center justify-between rounded-md px-1 py-1 cursor-pointer"
        >
          <SwitchIcon />
        </div>
      </Topnav>
      <DragScroll>
        <FetchFamilyTree />
      </DragScroll>

      {showChoosePopup && (
        <ChoosePopup showPopup={showChoosePopup} setShowPopup={setShowChoosePopup} />
      )}
    </div>
  );
}
