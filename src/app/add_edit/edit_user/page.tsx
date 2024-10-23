// app/relatives/page.js (or any file in the app/ directory)
import prisma from "@/db/db";
import List from "./List";
import Container from "@/components/Container";
import { ButtonSolid } from "../_components/Button";
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
            <Form />
        </Container>
        <div className="w-full">
            <List users={users} />
        </div>
    </div>
  )
}