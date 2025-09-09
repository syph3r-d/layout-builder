import { DeleteOutlined } from "@ant-design/icons";
import { useDroppable } from "@dnd-kit/core";

export const TrashSection = () => {
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: "trash",
  });
  return (
    <div
      ref={setDroppableNodeRef}
      className={` ${
        isOver ? "bg-red-400" : "bg-white"
      }  border border-gray-300 rounded-lg p-4 text-center text-gray-700 font-semibold w-lg`}
    >
      <DeleteOutlined />
    </div>
  );
};
