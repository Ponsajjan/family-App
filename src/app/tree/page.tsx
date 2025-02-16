import Topnav from "@/components/Topnav";
import FetchFamilyTree from "./FetchFamilyTree";
import DragScroll from "@/components/DragScroll";

export const dynamic = "force-dynamic"

export default function FamilyTreePage() {
  const topLevelMembers = [
    { id: 1 }
  ];

  return (
    <div className="w-full">
      <Topnav />
      {/* <div className="pl-2 md:px-8 pr-4 overflow-auto h-[calc(100vh-3rem)]"> */}
      <DragScroll>
        <FetchFamilyTree memberIds={topLevelMembers.map((member) => member.id)} />
      </DragScroll>
      {/* </div> */}
    </div>
  );
}
