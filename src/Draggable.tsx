import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { HolderOutlined } from "@ant-design/icons";

export function Draggable(props: { children: React.ReactNode; id: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1 bg-blue-200 rounded-xl"
    >
      <span
        {...listeners}
        {...attributes}
        className="cursor-grab flex items-center bg-gray-300 h-full rounded-l-xl p-1"
      >
        <HolderOutlined />
      </span>
      <div className="p-2">{props.children}</div>
    </div>
  );
}
