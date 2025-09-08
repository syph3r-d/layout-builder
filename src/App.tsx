import React from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { Draggable } from "./Draggable";
import { LayoutSection } from "./components/LayoutSection";
import { useState } from "react";
import { Chart } from "./components/widgets/LineChart";
import { ResizableWidget } from "./components/ResizableWidget";

interface LayoutComponent {
  id: string;
  component: ComponentInstance[];
  height: number;
  setHeight?: (height: number) => void;
}

interface ComponentInstance {
  id: string;
  component: React.ReactNode;
}

export default function App() {
  const [layoutComponentsMap, setLayoutComponentsMap] = useState<
    LayoutComponent[]
  >([]);

  const onAddSection = () => {
    const newSectionId = uuidv4();
    setLayoutComponentsMap((prev) => [
      ...prev,
      {
        id: newSectionId,
        component: [],
        height: 200,
        setHeight: (height: number) => {
          setLayoutComponentsMap((current) =>
            current.map((section) =>
              section.id === newSectionId ? { ...section, height } : section
            )
          );
        },
      },
    ]);
  };

  const widgetsComponents = [
    {
      name: "Line Chart",
      component: <Chart />,
      id: "base-line-chart",
    },
  ];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const baseWidget = String(active.id).startsWith("base-");
    if (over) {
      const sectionIndex = layoutComponentsMap.findIndex(
        (section) => section.id === over.id
      );
      if (sectionIndex !== -1) {
        let newLayoutComponentsMap = [...layoutComponentsMap];
        if (baseWidget) {
          const widget = widgetsComponents.find(
            (w) => w.id === active.id
          )?.component;
          if (widget) {
            newLayoutComponentsMap[sectionIndex].component.push({
              id: uuidv4(),
              component: widget,
            });
          }
        } else {
          let fromSectionIndex = -1;
          let fromComponentIndex = -1;
          for (let i = 0; i < newLayoutComponentsMap.length; i++) {
            const compIdx = newLayoutComponentsMap[i].component.findIndex(
              (comp) => comp.id === active.id
            );
            if (compIdx !== -1) {
              fromSectionIndex = i;
              fromComponentIndex = compIdx;
              break;
            }
          }
          if (
            fromSectionIndex !== -1 &&
            fromComponentIndex !== -1 &&
            fromSectionIndex !== sectionIndex
          ) {
            const [movedComp] = newLayoutComponentsMap[
              fromSectionIndex
            ].component.splice(fromComponentIndex, 1);
            newLayoutComponentsMap[sectionIndex].component.push(movedComp);
          }
        }
        setLayoutComponentsMap(newLayoutComponentsMap);
      }
    }
  }
  return (
    <>
      <div className="text-lg font-bold text-center">Layout Builder</div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-2 my-2">
          {widgetsComponents.map((widget) => (
            <Draggable key={widget.id} id={widget.id}>
              {widget.name}
            </Draggable>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {layoutComponentsMap.map((section) => (
            <LayoutSection
              key={section.id}
              id={section.id}
              height={section.height}
            >
              {section.component.map((comp, index) => (
                <Draggable id={comp.id}>
                  <ResizableWidget
                    key={index}
                    height={section.height}
                    setHeight={section.setHeight}
                  >
                    {comp.component}
                  </ResizableWidget>
                </Draggable>
              ))}
            </LayoutSection>
          ))}
        </div>
      </DndContext>
      <Button
        className="mt-2"
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAddSection}
      ></Button>
    </>
  );
}
