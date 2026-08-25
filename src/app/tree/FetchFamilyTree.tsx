'use client'

import { useEffect, useState } from "react";
import { Female, Male } from "@/utils/Icons";

// Toggle icon for expanding/collapsing a root family
const ToggleIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg viewBox="0 0 24 24" width="0.875rem" height="0.875rem" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    {collapsed && <line x1="12" y1="5" x2="12" y2="19" />}
  </svg>
);

// Finds the deepest chain of next_gen nesting in the tree data
const getMaxDepth = (nodes: any[] | null | undefined): number => {
  if (!nodes || nodes.length === 0) return 0;
  let max = 1;
  for (const node of nodes) {
    if (node.next_gen && node.next_gen.length > 0) {
      max = Math.max(max, 1 + getMaxDepth(node.next_gen));
    }
  }
  return max;
};

// TreeNode Component
const TreeNode = ({
  node,
  onMemberClick,
  depth,
  maxVisibleDepth,
}: {
  node: any;
  onMemberClick: (id: number) => void;
  depth: number;
  maxVisibleDepth: number;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasNextGen = node.next_gen && node.next_gen.length > 0;
  const withinVisibleDepth = depth < maxVisibleDepth;

  // The generation toggle defines which nodes should be visible; a stale
  // manual collapse from a previous toggle position must not override it.
  useEffect(() => {
    setCollapsed(false);
  }, [maxVisibleDepth]);

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
        {hasNextGen && withinVisibleDepth && (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand family" : "Collapse family"}
            title={collapsed ? "Expand family" : "Collapse family"}
            className={`ml-2 self-center flex items-center justify-center w-6 h-6 md:w-7 md:h-7 shrink-0 rounded-full border-2 cursor-pointer z-10 ${collapsed ? "bg-black border-black text-white" : "bg-field_color border-text_color text-text_color"}`}
          >
            <ToggleIcon collapsed={collapsed} />
          </button>
        )}
      </div>
      {hasNextGen && withinVisibleDepth && !collapsed && (
        <TreeView data={node.next_gen} onMemberClick={onMemberClick} depth={depth + 1} maxVisibleDepth={maxVisibleDepth} />
      )}
    </div>
  );
};

// TreeView Component
const TreeView = ({
  data,
  onMemberClick,
  depth,
  maxVisibleDepth,
}: {
  data: any[];
  onMemberClick: (id: number) => void;
  depth: number;
  maxVisibleDepth: number;
}) => {
  return (
    <div className="ml-10 md:ml-20 first:ml-0">
      <div className="border-l-2 border-text_color">
        {data.map((node: any, index: number) => (
          <TreeNode key={index} node={node} onMemberClick={onMemberClick} depth={depth} maxVisibleDepth={maxVisibleDepth} />
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
  const maxDepth = getMaxDepth(data);
  const [visibleGenerations, setVisibleGenerations] = useState(maxDepth || 1);

  useEffect(() => {
    setVisibleGenerations(getMaxDepth(data) || 1);
  }, [data]);

  if (!data || data.length === 0) {
    return <div className="text-center text-text_color p-10">No data available.</div>;
  }

  return (
    <>
      <div className="flex">
        <TreeView data={data} onMemberClick={onMemberClick} depth={1} maxVisibleDepth={visibleGenerations} />
        <div className="pr-6"></div>
      </div>
      <div className="pb-24 md:pb-6"></div>
      <div className="fixed inset-x-0 bottom-0 md:inset-x-auto md:right-4 md:bottom-4 z-20 flex items-center justify-between md:justify-center gap-3 w-full md:w-auto px-4 py-3 md:p-1.5 border-t-2 md:border-2 border-text_color bg-field_color md:rounded-lg md:shadow-lg cursor-default">
        <button
          type="button"
          onClick={() => setVisibleGenerations((g) => Math.max(1, g - 1))}
          disabled={visibleGenerations <= 1}
          className="flex-none px-3 py-1.5 text-sm font-medium rounded-lg border-2 border-text_color text-text_color bg-main_background disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          ‹<span className="hidden sm:inline"> Prev</span>
        </button>
        <span className="text-sm font-medium text-text_color whitespace-nowrap">
          Generation {visibleGenerations} of {maxDepth}
        </span>
        <button
          type="button"
          onClick={() => setVisibleGenerations((g) => Math.min(maxDepth, g + 1))}
          disabled={visibleGenerations >= maxDepth}
          className="flex-none px-3 py-1.5 text-sm font-medium rounded-lg border-2 border-text_color text-text_color bg-main_background disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="hidden sm:inline">Next </span>›
        </button>
      </div>
    </>
  );
}
