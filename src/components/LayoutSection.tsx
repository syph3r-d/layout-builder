import React, { useState, cloneElement, isValidElement } from "react";
import { useDroppable } from "@dnd-kit/core";

export const LayoutSection = ({
  children,
  id,
  height,
}: {
  children: React.ReactNode;
  id: string;
  height: number;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      className={`flex gap-2 justify-start max-w-full min-h-24 min-w-24 border border-blue-50 rounded-xl mx-2 p-2 ${
        isOver ? "bg-blue-300" : "bg-blue-100"
      }`}
      ref={setNodeRef}
      style={{
        height: height + 20,
      }}
    >
      {children}
    </div>
  );
};
