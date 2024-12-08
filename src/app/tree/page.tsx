import Topnav from "@/components/Topnav";
import FetchFamilyTree from "./FetchFamilyTree";
import DragScroll from "@/components/DragScroll";

export default function FamilyTreePage() {
  const topLevelMembers = [
    { id: 24 }, { id: 31 }, { id: 30 }, { id: 29 },
    { id: 25 }, { id: 22 }, { id: 4 }, { id: 20 },
    { id: 8 }, { id: 28 }, { id: 3 }, { id: 33 },
    { id: 32 }, { id: 34 }, { id: 35 }, { id: 15 },
    { id: 23 }, { id: 13 }, { id: 26 }, { id: 17 },
    { id: 14 },
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
