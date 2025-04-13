"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({
  id,
  children,
}: {
  id: number | string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid var(--mui-divider)",
    marginBottom: "12px",
  };

  return (
    <div
      className="flex items-center w-full rounded-lg gap-4 p-4 bg-background overflow-hidden"
      ref={setNodeRef}
      style={style}
    >
      <div
        className="bg-paper p-2"
        {...listeners}
        {...attributes}
        style={{
          cursor: "grab",
          padding: "4px",
          userSelect: "none",
          fontSize: "20pt",
          opacity: isDragging ? 0.7 : 1,
          scale: isDragging ? 0.8 : 1,
          transition: "scale 0.2s",
          borderRadius: "8px",
          backgroundColor: "var(--mui-background-paper)",
        }}
      >
        ⠿
      </div>
      {children}
    </div>
  );
}
