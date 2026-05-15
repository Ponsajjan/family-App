'use client';

import { useRef } from "react";

export default function DragScroll({ children }: { children: React.ReactNode }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  let isDragging = false;
  let startX: number;
  let startY: number;
  let scrollLeft: number;
  let scrollTop: number;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging = true;
    startX = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    startY = e.pageY - (scrollContainerRef.current?.offsetTop || 0);
    scrollLeft = scrollContainerRef.current?.scrollLeft || 0;
    scrollTop = scrollContainerRef.current?.scrollTop || 0;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walkX = (x - startX) * 1.5; // Adjust scroll speed horizontally
    const walkY = (y - startY) * 1.5; // Adjust scroll speed vertically
    scrollContainerRef.current.scrollLeft = scrollLeft - walkX;
    scrollContainerRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseUp = () => {
    isDragging = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseLeave = () => {
    isDragging = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="cursor-grab select-none overflow-auto px-4 w-full h-[calc(100vh-3rem)]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
