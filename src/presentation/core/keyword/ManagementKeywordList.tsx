"use client";

import { useTranslatorContext } from "@/src/application/hooks/useTranslator";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import { EditableKeywordCard } from "./KeywordCard";

export default function ManagementKeywordList() {
  const { keywordsManager, langsManager, updateVersion, refresh } =
    useTranslatorContext();

  const keywordsContainer = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(keywordsManager.get());
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  useEffect(() => {
    setItems(keywordsManager.get());
  }, [updateVersion]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      keywordsManager.move(Number(active.id) - 1, Number(over?.id) - 1);
      refresh();
    }
  };

  const onClick = () => {
    keywordsManager.add("", "");
    refresh();
    keywordsContainer.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return (
    <div className="h-full p-8 flex flex-col overflow-x-hidden">
      <div className="flex justify-between items-center w-full ">
        <Dropdown
          options={langsManager.get()}
          onChange={(o) => langsManager.update(o)}
          variant=""
        />
        <h4>Translation Management</h4>
      </div>
      <div className="management-keyword">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map(({ id, keyword, translation }, index) => (
              <SortableItem key={id} id={id}>
                <EditableKeywordCard
                  index={index}
                  id={id}
                  keyword={keyword}
                  initialTranslation={translation}
                />
              </SortableItem>
            ))}
            <div ref={keywordsContainer}></div>
          </SortableContext>
        </DndContext>
      </div>

      <button className="management-keyword-btn" onClick={onClick}>
        Add new keyword +
      </button>
    </div>
  );
}
