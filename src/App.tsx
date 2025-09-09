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
  order: number;
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
      const overWidget = componentsList.find((widget) => widget.id === over.id);

      if (sectionIndex !== -1 || overWidget) {
        if (baseWidget) {
          // Only handle dropping base widgets on sections
          if (sectionIndex !== -1) {
            const widget = widgetsComponents.find(
              (w) => w.id === active.id
            )?.component;
            if (widget) {
              const widgetsInSection = componentsList.filter(
                (c) => c.sectionId === over.id
              );
              setComponentsList((prev) => [
                ...prev,
                {
                  id: uuidv4(),
                  component: widget,
                  width: 200,
                  sectionId: String(over.id),
                  order: widgetsInSection.length,
                },
              ]);
            }
          }
        } else {
          // Handle dropping existing widgets
          const draggedIndex = componentsList.findIndex(
            (comp) => comp.id === active.id
          );

          if (draggedIndex !== -1) {
            const dragged = componentsList[draggedIndex];

            // Check if dropping on a widget
            if (overWidget) {
              if (dragged.sectionId === overWidget.sectionId) {
                // Same section: reorder
                let widgets = componentsList
                  .filter((c) => c.sectionId === dragged.sectionId)
                  .sort((a, b) => a.order - b.order);

                const from = widgets.findIndex((c) => c.id === dragged.id);
                const to = widgets.findIndex((c) => c.id === overWidget.id);

                widgets.splice(from, 1);
                widgets.splice(to, 0, dragged);

                // Reassign order
                widgets = widgets.map((w, idx) => ({ ...w, order: idx }));

                // Update componentsList
                setComponentsList((prev) => [
                  ...prev.filter((c) => c.sectionId !== dragged.sectionId),
                  ...widgets,
                ]);
              } else {
                // Different section: move widget
                const targetSectionWidgets = componentsList
                  .filter((c) => c.sectionId === overWidget.sectionId)
                  .sort((a, b) => a.order - b.order);

                const insertIndex = targetSectionWidgets.findIndex(
                  (c) => c.id === overWidget.id
                );

                // Remove from old section and add to new section
                const updatedDragged = {
                  ...dragged,
                  sectionId: overWidget.sectionId,
                  order: insertIndex,
                };

                // Update orders in target section
                const updatedTargetWidgets = [
                  ...targetSectionWidgets
                    .slice(0, insertIndex)
                    .map((w) => ({ ...w, order: w.order })),
                  updatedDragged,
                  ...targetSectionWidgets
                    .slice(insertIndex)
                    .map((w) => ({ ...w, order: w.order + 1 })),
                ].map((w, idx) => ({ ...w, order: idx }));

                // Update orders in source section
                const sourceWidgets = componentsList
                  .filter(
                    (c) =>
                      c.sectionId === dragged.sectionId && c.id !== dragged.id
                  )
                  .sort((a, b) => a.order - b.order)
                  .map((w, idx) => ({ ...w, order: idx }));

                // Update componentsList
                setComponentsList((prev) => [
                  ...prev.filter(
                    (c) =>
                      c.sectionId !== dragged.sectionId &&
                      c.sectionId !== overWidget.sectionId
                  ),
                  ...sourceWidgets,
                  ...updatedTargetWidgets,
                ]);
              }
            } else if (sectionIndex !== -1) {
              // Dropping on empty section or section area
              const targetSectionId = String(over.id);
              if (dragged.sectionId !== targetSectionId) {
                const targetSectionWidgets = componentsList.filter(
                  (c) => c.sectionId === targetSectionId
                );

                // Move to end of target section
                const updatedDragged = {
                  ...dragged,
                  sectionId: targetSectionId,
                  order: targetSectionWidgets.length,
                };

                // Update orders in source section
                const sourceWidgets = componentsList
                  .filter(
                    (c) =>
                      c.sectionId === dragged.sectionId && c.id !== dragged.id
                  )
                  .sort((a, b) => a.order - b.order)
                  .map((w, idx) => ({ ...w, order: idx }));

                // Update componentsList
                setComponentsList((prev) => [
                  ...prev.filter(
                    (c) =>
                      c.sectionId !== dragged.sectionId &&
                      c.sectionId !== targetSectionId
                  ),
                  ...sourceWidgets,
                  ...targetSectionWidgets,
                  updatedDragged,
                ]);
              }
            }
          }
        }
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
        <div className="flex flex-col">
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
                    .sort((a, b) => a.order - b.order)
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
                            const parentPadding = 32;
                            const widgetPadding = 32;
                            const gap = 20;
                            const widgets = componentsList.filter(
                              (c) => c.sectionId === section.id
                            );
                            const numWidgets = widgets.length;
                            const otherWidgetsTotal = widgets
                              .filter((c) => c.id !== comp.id)
                              .reduce((sum, c) => sum + c.width, 0);
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
