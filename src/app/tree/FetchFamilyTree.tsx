import prisma from "@/db/db";
import { verifyToken } from "@/utils/auth";
import { Female, Male } from "@/utils/Icons";
import { cookies } from "next/headers";

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

export default async function FetchFamilyTree() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return <div className="text-center text-text_color p-10">Unauthorized. Please login.</div>;
  }

  try {
    const decoded = await verifyToken(token);
    const authId = decoded.authId;

    if (!authId) {
      return <div className="text-center text-text_color p-10">Invalid session.</div>;
    }

    const familyTree = await prisma.familyTree.findUnique({
      where: { authId: authId },
      select: { data: true }
    });

    if (!familyTree) {
      return <div className="text-center text-text_color p-10">No chart found.</div>;
    }

    const data = familyTree.data as any[];

    if (data.length === 0) {
      return <div className="text-center text-text_color p-10">No data available.</div>;
    }

    return (
      <>
        <div className="flex">
          <TreeView data={data} />
          <div className="pr-6"></div>
        </div>
        <div className="pb-6"></div>
      </>
    );
  } catch (error) {
    console.error("Error loading family tree:", error);
    return <div className="text-center text-text_color p-10">Failed to load family tree data.</div>;
  }
}