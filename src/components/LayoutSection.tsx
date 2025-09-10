import React, { useEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { MinusCircleOutlined } from "@ant-design/icons";

export const LayoutSection = ({
  children,
  id,
  height,
  calculateOccupiedWidth,
  onDelete,
}: {
  children: (width: number) => React.ReactNode;
  id: string;
  height: number;
  calculateOccupiedWidth: (containerWidth: number) => number;
  onDelete?: (id: string) => void;
}) => {
  const [width, setWidth] = useState<number>(0);
  const [droppingDisabled, setDroppingDisabled] = useState(false);
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    disabled: droppingDisabled,
  });
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const updateDroppableState = () => {
      if (!sectionRef.current) return;
      const containerWidth = sectionRef.current.offsetWidth;
      const occupiedWidth = calculateOccupiedWidth(containerWidth);
      const availableWidth = containerWidth - occupiedWidth;

      setWidth(containerWidth);
      setDroppingDisabled(availableWidth < 330);
    };

    updateDroppableState();
    window.addEventListener("resize", updateDroppableState);
    return () => window.removeEventListener("resize", updateDroppableState);
  }, [calculateOccupiedWidth]);

  // Attach sectionRef to the div below by combining with setNodeRef
  const combinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    sectionRef.current = node;
  };
  return (
    <div
      className={`flex gap-2 justify-start max-w-full min-h-24 min-w-24 rounded-xl mx-2 p-2  ${
        isOver
          ? "bg-blue-300"
          : droppingDisabled
          ? "bg-gray-200"
          : "bg-blue-100"
      }`}
      ref={combinedRef}
      style={{
        height: height + 20,
      }}
    >
      <MinusCircleOutlined
        className=" mt-2 "
        style={{
          cursor: "pointer",
          color: "blue",
        }}
        onClick={onDelete ? () => onDelete(id) : undefined}
      />
      {children(width)}
    </div>
  );
};
