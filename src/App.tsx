import React from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { Draggable } from "./components/Draggable";
import { LayoutSection } from "./components/LayoutSection";
import { useState } from "react";
import { Chart } from "./components/widgets/LineChart";
import { ResizableWidget } from "./components/ResizableWidget";
import Barchart from "./components/widgets/BarChart";

interface LayoutComponent {
  id: string;
  height: number;
  setHeight?: (height: number) => void;
}

interface ComponentInstance {
  id: string;
  component: React.ReactNode;
  width: number;
  sectionId: string;
}

export default function App() {
  const [layoutComponentsMap, setLayoutComponentsMap] = useState<
    LayoutComponent[]
  >([]);
  const [componentsList, setComponentsList] = useState<ComponentInstance[]>([]);

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
    {
      name: "Bar Chart",
      component: <Barchart />,
      id: "base-bar-chart",
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
        if (baseWidget) {
          const widget = widgetsComponents.find(
            (w) => w.id === active.id
          )?.component;
          if (widget) {
            setComponentsList((prev) => [
              ...prev,
              {
                id: uuidv4(),
                component: widget,
                width: 200,
                sectionId: String(over.id),
              },
            ]);
          }
        } else {
          const draggedComponentIndex = componentsList.findIndex(
            (comp) => comp.id === active.id
          );
          if (draggedComponentIndex !== -1) {
            const updatedComponent = {
              ...componentsList[draggedComponentIndex],
              sectionId: String(over.id),
            };
            setComponentsList((prev) => {
              const newList = [...prev];
              newList.splice(draggedComponentIndex, 1);
              newList.push(updatedComponent);
              return newList;
            });
          }
        }
        // setLayoutComponentsMap(newLayoutComponentsMap);
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
              {(width) => (
                <>
                  {componentsList
                    .filter((comp) => comp.sectionId === section.id)
                    .map((comp) => (
                      <Draggable id={comp.id} key={comp.id}>
                        <ResizableWidget
                          key={comp.id}
                          height={section.height}
                          setHeight={section.setHeight}
                          width={comp.width}
                          setWidth={(width: number) => {
                            setComponentsList((prev) =>
                              prev.map((c) =>
                                c.id === comp.id ? { ...c, width } : c
                              )
                            );
                          }}
                          maxWidth={(() => {
                            // LayoutSection: p-2 (16px total), gap-2 (8px), ResizableWidget: p-4 (32px per widget)
                            const parentPadding = 32; // px (left+right)
                            const widgetPadding = 32; // px (left+right)
                            const gap = 20; // px
                            const widgets = componentsList.filter(
                              (c) => c.sectionId === section.id
                            );
                            const numWidgets = widgets.length;
                            const otherWidgetsTotal = widgets
                              .filter((c) => c.id !== comp.id)
                              .reduce((sum, c) => sum + c.width, 0);
                            // Total horizontal space taken by gaps and paddings
                            const totalGaps = (numWidgets - 1) * gap;
                            const totalWidgetPadding =
                              numWidgets * widgetPadding;
                            const totalParentPadding = parentPadding;
                            const available =
                              width -
                              totalGaps -
                              totalWidgetPadding -
                              totalParentPadding -
                              otherWidgetsTotal;
                            return Math.max(available, 100);
                          })()}
                        >
                          {comp.component}
                        </ResizableWidget>
                      </Draggable>
                    ))}
                </>
              )}
            </LayoutSection>
          ))}
        </div>
      </DndContext>
      <div className="flex gap-2 justify-center">
        <hr />
        <Button
          className="mt-2"
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddSection}
        ></Button>
        <hr />
      </div>
    </>
  );
}
