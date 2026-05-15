'use client'

import { Female, Male } from "@/utils/Icons";

// TreeNode Component
const TreeNode = ({ node, onMemberClick }: { node: any, onMemberClick: (id: number) => void }) => {
  return (
    <div className="bg-main_background pt-4 md:pt-[1.625rem] last:-ml-[0.1875rem] last:pl-[0.1875rem]">
      <div className="flex">
        {node.gen.map((data: any, index: number) => (
          <div
            key={index}
            className={`flex items-start -ml-[0.125rem] ${index === 0 ? "first:pt-0 pt-4 md:pt-6" : ""}`}
          >
            {index === 0 ? (
              <div className="-mt-[1.125rem] md:-mt-[1.75rem] block relative w-[1.875rem] md:w-[3.75rem] h-[2.5rem] md:h-[3.4375rem] border-l-2 border-b-2 border-text_color rounded-bl-lg">
                <span className="absolute right-0 -bottom-[0.0625rem] transform translate-y-1/2 border-[0.375rem] border-l-black border-main_background border-r-0" />
              </div>
            ) : (
              <div className="ml-[0.125rem] mt-[1.125rem] md:mt-6 block relative w-[1.875rem] md:w-[3.75rem] border-b-2 border-text_color">
                <span className="absolute right-0 -bottom-[0.0625rem] transform translate-y-1/2 border-[0.375rem] border-l-black border-main_background border-r-0" />
                <span className="absolute left-0 -bottom-[0.0625rem] transform translate-y-1/2 border-[0.375rem] border-r-black border-main_background border-l-0" />
              </div>
            )}
            <div
              onClick={() => onMemberClick(data.id)}
              className="p-2 flex gap-2 justify-between items-center text-sm z-10 md:text-base md:px-4 md:py-3 bg-field_color text-text_color border-2 border-text_color text-nowrap whitespace-nowrap rounded-lg cursor-pointer"
            >
              {data.gender === "Male" && <Male />}
              {data.gender === "Female" && <Female />}
              <span className="font-medium capitalize">{data.name}</span>
            </div>
          </div>
        ))}
      </div>
      {node.next_gen && <TreeView data={node.next_gen} onMemberClick={onMemberClick} />}
    </div>
  );
};

// TreeView Component
const TreeView = ({ data, onMemberClick }: { data: any[], onMemberClick: (id: number) => void }) => {
  return (
    <div className="ml-10 md:ml-20 first:ml-0">
      <div className="border-l-2 border-text_color">
        {data.map((node: any, index: number) => (
          <TreeNode key={index} node={node} onMemberClick={onMemberClick} />
        ))}
      </div>
    </div>
  );
};

interface FetchFamilyTreeProps {
  data: any[] | null;
  onMemberClick: (id: number) => void;
}

export default function FetchFamilyTree({ data, onMemberClick }: FetchFamilyTreeProps) {
  if (!data || data.length === 0) {
    return <div className="text-center text-text_color p-10">No data available.</div>;
  }

  return (
    <>
      <div className="flex">
        <TreeView data={data} onMemberClick={onMemberClick} />
        <div className="pr-6"></div>
      </div>
      <div className="pb-6"></div>
    </>
  );
}
