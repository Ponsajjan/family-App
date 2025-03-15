
import Topnav from "@/components/Topnav";
import FetchFamilyTree from "./FetchFamilyTree";
import DragScroll from "@/components/DragScroll";
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic"

export default async function FamilyTreePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!token) {
    console.error('Token is missing');
    return (
      <div className="w-full">
        <Topnav />
        <div className="text-center text-text_color m-6">Unauthorized. Please log in.</div>
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
      throw new Error('Failed to fetch data');
    }

    id = await response.json();
  } catch (error) {
    console.error('Error fetching tree data:', error);
    return <div>Failed to load family tree data.</div>;
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
