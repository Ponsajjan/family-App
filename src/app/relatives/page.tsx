// app/relatives/page.js (or any file in the app/ directory)
import prisma from "@/db/db";
import { SearchIcon } from "@/utils/Icons";
import List from "./List";
import Topnav from "@/components/Topnav";

// Mark this as a server component
export const dynamic = 'force-dynamic'; // Optional, forces dynamic rendering
// Since app/ uses server-side rendering by default, we can make this an async function
export default async function Relatives() {
  // Fetch users from the database using Prisma
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      contactNumber: true,
      currentLocation: true,
    },
    // take: 4,
    orderBy: { name: "asc" },
  });

  return (
    <div className="w-full">
        <Topnav>
            <div className="relative w-full ml-2">
              <input
                  type="text"
                  className="p-1 pl-8 border border-border_color outline-1 outline-border_color font-normal rounded-md w-full bg-main_background"
              />
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-main_background">
                  <SearchIcon />
              </span>
            </div>
            <p className="w-10 text-center">i</p>
        </Topnav>
        <List users={users} />
    </div>
  );
}
