import prisma from "@/db/db";
import { Female, Male, SvgArrow, SvgArrowStraight } from "@/utils/Icons";

// TreeNode Component
const TreeNode = ({ node }: { node: any }) => {
  return (
    <div className="bg-main_background pt-6 md:pt-7 last:-ml-[4px] last:pl-[4px]">
      <div className="flex">
        {node.gen.map((data: any, index: number) => (
          <div
            key={index}
            className={`flex items-start -ml-[2px] ${index === 0 ? "first:pt-0 pt-4 md:pt-6" : ""}`}
          >
            {index === 0 ? (
              <span className="-mt-[40px] md:-mt-[28px] block">
                <SvgArrow />
              </span>
            ) : (
              <span className="ml-[2px] mt-[14px] md:mt-6 block">
                <SvgArrowStraight />
              </span>
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
    <div className="ml-20 first:ml-4 first:md:ml-8">
      <div className="border-l-2 md:border-l-2 border-text_color">
        {data.map((node: any, index: number) => (
          <TreeNode key={index} node={node} />
        ))}
      </div>
    </div>
  );
};

// Fetch the family tree data and return JSX
async function fetchFamilyTree(memberIds: number[]): Promise<any[]> {
  try {
    if (!memberIds || memberIds.length === 0) return [];

    let members = [];
    try {
      if (!prisma?.member?.findMany) {
        throw new Error("Prisma is not initialized or 'findMany' method is unavailable.");
      }
    
      members = await prisma.member.findMany({
        where: { id: { in: memberIds } },
        include: {
          fatherOf: { select: { id: true, name: true, gender: true } },
          motherOf: { select: { id: true, name: true, gender: true } },
          partner: { select: { id: true, name: true, gender: true } },
        },
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      throw new Error("Failed to fetch members data.");
    }

    return await Promise.all(
      members.map(async (member) => {
        try {
          const childIds = [
            ...member.fatherOf.map((child) => child.id),
            ...member.motherOf.map((child) => child.id),
          ];

          const nextGen = await fetchFamilyTree(childIds);

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
    return []
  }
}


export default async function FetchFamilyTree({ memberIds }: { memberIds: number[] }) {
  const data = await fetchFamilyTree(memberIds);
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
