import React from "react";
import { useDroppable } from "@dnd-kit/core";

export const LayoutSection = ({
  children,
  id,
  height,
}: {
  children: (width: number) => React.ReactNode;
  id: string;
  height: number;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const [width, setWidth] = React.useState<number>(0);
  const sectionRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const updateWidth = () => {
      setWidth(sectionRef.current!.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Attach sectionRef to the div below by combining with setNodeRef
  const combinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    sectionRef.current = node;
  };
  return (
    <div
      className={`flex gap-2 justify-start max-w-full min-h-24 min-w-24 rounded-xl mx-2 p-2 ${
        isOver ? "bg-blue-300" : "bg-blue-100"
      }`}
      ref={combinedRef}
      style={{
        height: height + 20,
      }}
    >
      {children(width)}
    </div>
  );
};
