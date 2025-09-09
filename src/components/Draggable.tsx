import React, { useEffect } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { HolderOutlined } from "@ant-design/icons";

export function Draggable(props: {
  children: React.ReactNode;
  id: string;
  setIsDragging?: (dragging: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: props.id,
    });
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: props.id,
    disabled: isDragging,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const combinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    setDroppableNodeRef(node);
  };

  useEffect(() => {
    if (props.setIsDragging) props.setIsDragging(isDragging);
  }, [isDragging]);

  return (
    <div
      ref={combinedRef}
      style={style}
      className={`flex items-center gap-1 rounded-xl ${
        isOver ? "bg-blue-300" : "bg-blue-200"
      }`}
    >
      <span
        {...listeners}
        {...attributes}
        className="cursor-grab flex items-center bg-gray-300 h-full rounded-l-xl"
      >
        <HolderOutlined />
      </span>
      <div className="p-2">{props.children}</div>
    </div>
  );
}
