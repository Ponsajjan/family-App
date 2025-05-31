import Topnav from "@/components/Topnav";
import FetchFamilyTree from "./FetchFamilyTree";
import DragScroll from "@/components/DragScroll";
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic"

export const revalidate = 600;

export default async function FamilyTreePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!token) {
    console.error('Token is missing');
    return (
      <div className="w-full">
        <Topnav />
        <div className="text-center text-text_color m-6">Unauthorized. Please login.</div>
      </div>);
  }

  let id;
  try {
    const response = await fetch(`${baseUrl}/api/tree`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return (
        <div>
          <Topnav />
          <p className="text-center text-text_color m-6">Failed to load family tree data. Responce not ok</p>
        </div>
      )
    }

    id = await response.json();
  } catch (error) {
    console.error('Error fetching tree data:', error);
    return (
      <div>
        <Topnav />
        <p className="text-center text-text_color m-6">{`Failed to load family tree data. ${error}`}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Topnav />
      <DragScroll>
        <FetchFamilyTree memberId={[id]} />
      </DragScroll>
    </div>
  );
}
