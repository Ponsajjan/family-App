"use client";

import Topnav from "@/components/Topnav";
import FetchFamilyTree from "./FetchFamilyTree";
import DragScroll from "@/components/DragScroll";

export default function FamilyTreePage() {
  return (
    <div className="w-full">
      <Topnav />
      <DragScroll>
        <FetchFamilyTree />
      </DragScroll>
    </div>
  );
}

