// app/relatives/page.js (or any file in the app/ directory)
import prisma from "@/db/db";
import List from "./List";
import Container from "@/components/Container";
import { ButtonSolid } from "../../../components/Button";
import Form from "./Form";

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
    <div className='md:flex text-text_color'>
      <Container className="px-3 pt-4 md:pt-0 md:border-r md:border-border_color">
          <div className="w-full lg:max-w-xl mx-auto">
            <Form />
          </div>
      </Container>
      <div className="w-full lg:max-w-lg mx-auto">
          <List users={users} />
      </div>




{/* <div className='md:flex text-text_color'>
<Container className="px-3 pt-4 md:pt-0 md:border-r md:border-border_color">
    <Form />
</Container>
{showDetails && (
<div onClick={() => setShowDetails(false)} className="fixed md:hidden inset-0 bg-gray-500 bg-opacity-75 transition-opacity cursor-not-allowed z-40" />
)}
<div className={`${ showDetails
    ? "block md:static fixed left-0 right-0 bottom-0 min-h-[60%] max-h-[90%] md:h-full z-40 rounded-t-md"
    : "hidden md:block" } w-full bg-main_background px-5 overflow-y-auto pb-4`} >
    <List users={users} />
</div>
</div> */}
    </div>
  )
}