'use server'

import prisma from "@/db/db";
import { Female, Male } from "@/utils/Icons";

// TreeNode Component
const TreeNode = ({ node }: { node: any }) => {
  return (
    <div className="bg-main_background pt-4 md:pt-[26px] last:-ml-[3px] last:pl-[3px]">
      <div className="flex">
        {node.gen.map((data: any, index: number) => (
          <div
            key={index}
            className={`flex items-start -ml-[2px] ${index === 0 ? "first:pt-0 pt-4 md:pt-6" : ""}`}
          >
            {index === 0 ? (
              <div className="-mt-[18px] md:-mt-[28px] block relative w-[30px] md:w-[60px] h-[40px] md:h-[55px] border-l-2 border-b-2 border-text_color rounded-bl-lg">
                <span className="absolute right-0 -bottom-[1px] transform translate-y-1/2 border-[6px] border-l-black border-main_background border-r-0" />
              </div>
            ) : (
              <div className="ml-[2px] mt-[18px] md:mt-6 block relative w-[30px] md:w-[60px] border-b-2 border-text_color">
                <span className="absolute right-0 -bottom-[1px] transform translate-y-1/2 border-[6px] border-l-black border-main_background border-r-0" />
                <span className="absolute left-0 -bottom-[1px] transform translate-y-1/2 border-[6px] border-r-black border-main_background border-l-0" />
              </div>
            )}
            <div className="p-2 flex gap-2 justify-between items-center text-sm z-10 md:text-base md:px-4 md:py-3 bg-field_color text-text_color border-2 border-text_color text-nowrap whitespace-nowrap rounded-lg">
              {data.gender === "Male" && <Male />}
              {data.gender === "Female" && <Female />}
              <span className="font-medium capitalize">{data.name}</span>
            </div>
          </div>
        ))}
      </div>
      {node.next_gen && <TreeView data={node.next_gen} />}
    </div>
  );
};

// TreeView Component
const TreeView = ({ data }: { data: any[] }) => {
  return (
    <div className="ml-10 md:ml-20 first:ml-0">
      <div className="border-l-2 border-text_color">
        {data.map((node: any, index: number) => (
          <TreeNode key={index} node={node} />
        ))}
      </div>
    </div>
  );
};

// Fetch the family tree data and return JSX
async function fetchFamilyTreeData(memberId: number[]): Promise<any[]> {
  try {
    if (!memberId || memberId.length === 0) return [];

    let members = [];
    try {
      if (!prisma?.member?.findMany) {
        throw new Error("Prisma is not initialized or 'findMany' method is unavailable.");
      }

      // Fetch members with their relationships and order field
      members = await prisma.member.findMany({
        where: { id: { in: memberId }, verified: true },
        include: {
          fatherOf: { select: { id: true, name: true, gender: true, order: true } },
          motherOf: { select: { id: true, name: true, gender: true, order: true } },
          partner: { select: { id: true, name: true, gender: true } },
        },
        cacheStrategy: {
          ttl: 60 * 30,
          swr: 30
        }, // Cache for 30 minutes
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      throw new Error("Failed to fetch members data.");
    }

    // Sort members by their order value
    members.sort((a, b) => a.order - b.order);

    return await Promise.all(
      members.map(async (member) => {
        try {
          // Combine fatherOf and motherOf children and deduplicate by ID
          const childIds = [
            ...member.fatherOf.map((child) => child.id),
            ...member.motherOf.map((child) => child.id),
          ];

          // Fetch the next generation recursively
          const nextGen = await fetchFamilyTreeData(childIds);

          // Sort nextGen based on the order value of each child
          nextGen.sort((a, b) => a.order - b.order);

          // Current generation data
          const currentGen = [
            { name: member.name, gender: member.gender },
            ...(member.partner ? [{ name: member.partner.name, gender: member.partner.gender }] : []),
          ];

          return {
            gen: currentGen,
            next_gen: nextGen,
          };
        } catch (innerError) {
          console.error(`Error processing member ${member.id}:`, innerError);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error fetching family tree:", error);
    return [];
  }
}

export default async function FetchFamilyTree({ memberId }: { memberId: number[] }) {
  const data = await fetchFamilyTreeData(memberId);
  return (
    <>
      <div className="flex">
        <TreeView data={data} />
        <div className="pr-6"></div>
      </div>
      <div className="pb-6"></div>
    </>
  )
}