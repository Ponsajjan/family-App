// app/relatives/page.js (or any file in the app/ directory)
import prisma from "@/db/db";
import List from "./List";
import Container from "@/components/Container";
import { ButtonSolid } from "../../../components/Button";
import Form from "./Form";
import Link from "next/link";
import { BackButton, EditMember, SvgArrow } from "@/utils/Icons";

// Mark this as a server component
export const dynamic = 'force-dynamic'; // Optional, forces dynamic rendering
// Since app/ uses server-side rendering by default, we can make this an async function
export default async function Relatives() {
  // Fetch users from the database using Prisma
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
    },
    // take: 4,
    orderBy: { name: "asc" },
  });

  return (
    <div className='md:flex text-text_color'>
        <Container className="px-3 pt-4 md:pt-0 md:border-r md:border-border_color">
            <div className="w-full lg:max-w-xl mx-auto">
              <div className="flex justify-start items-center mb-4">
                  <Link href={"/add_edit"} className="block"><EditMember /></Link>
                  <p className="text-2xl font-semibold text-center text-text_color underline pl-3">Edit Member</p>
              </div>
              <Form />
            </div>
        </Container>
        <div className="w-full lg:max-w-lg mx-auto">
            <List users={users} />
        </div>
    </div>
  )
}