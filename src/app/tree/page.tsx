import Topnav from "@/components/Topnav";
import FetchFamilyTree from "./FetchFamilyTree";
import DragScroll from "@/components/DragScroll";
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic"

export default async function FamilyTreePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return (
      <div className="w-full">
        <Topnav />
        <div className="text-center text-text_color m-6">Unauthorized. Please login.</div>
      </div>);
  }

  return (
    <div className="w-full">
      <Topnav />
      <DragScroll>
        <FetchFamilyTree />
      </DragScroll>
    </div>
  );
}
