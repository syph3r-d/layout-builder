import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { Draggable } from "./Draggable";
import { LayoutSection } from "./LayoutSection";
import { useCallback, useState } from "react";
import { ResizableWidget } from "./ResizableWidget";
import { widgetsComponents } from "../utils/widgetsConfig";
import { TrashSection } from "./TrashSection";

export const Canvas = ({
  initialLayout,
  initialComponentList,
  canvasName,
}: {
  initialLayout?: LayoutComponent[];
  initialComponentList?: ComponentInstance[];
  canvasName: string;
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const initialLayoutWithsetHeight = initialLayout?.map((section) => ({
    ...section,
    setHeight: (height: number) => {
      setLayoutComponentsMap((current) =>
        current.map((sec) => (sec.id === section.id ? { ...sec, height } : sec))
      );
    },
  }));

  const initialComponentListwithComponent = initialComponentList?.map(
    (comp) => ({
      ...comp,
      component: widgetsComponents.find((w) => w.id === comp.type)?.component,
    })
  );

  const [layoutComponentsMap, setLayoutComponentsMap] = useState<
    LayoutComponent[]
  >(
    initialLayoutWithsetHeight ?? [
      {
        id: "1",
        height: 200,
        setHeight: (height: number) => {
          setLayoutComponentsMap((current) =>
            current.map((section) =>
              section.id === "1" ? { ...section, height } : section
            )
          );
        },
      },
    ]
  );
  const [componentsList, setComponentsList] = useState<ComponentInstance[]>(
    initialComponentListwithComponent ?? []
  );
  const [isDragging, setIsDragging] = useState(false);

  const onAddSection = () => {
    const newSectionId = uuidv4();
    setLayoutComponentsMap((prev) => [
      ...prev,
      {
        id: newSectionId,
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
    messageApi.success("Added new section");
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const baseWidget = String(active.id).startsWith("base-");
    if (String(over?.id) == "trash") {
      // Deleting a widget
      if (!baseWidget) {
        const widgetIndex = componentsList.findIndex(
          (widget) => widget.id === active.id
        );
        if (widgetIndex !== -1) {
          setComponentsList((prev) => [
            ...prev.slice(0, widgetIndex),
            ...prev.slice(widgetIndex + 1),
          ]);
        }
      }
      setIsDragging(false);
      messageApi.success("Widget deleted");
      return;
    }

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
                  type: String(active.id),
                  width: 0.2,
                  sectionId: String(over.id),
                  order: widgetsInSection.length,
                },
              ]);
            }
            messageApi.success("Added new widget");
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
                messageApi.success("Widget reordered");
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
                messageApi.success("Widget moved to another section");
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
              messageApi.success("Widget moved to another section");
            }
          }
        }
      }
    }
  }

  const calculateOccupiedWidth = useCallback(
    (
      sectionId: string,
      currentComp?: ComponentInstance,
      containerWidth?: number
    ) => {
      const parentPadding = 38;
      const widgetPadding = 34;
      const gap = 8;
      const widgets = componentsList.filter((c) => c.sectionId === sectionId);
      const numWidgets = widgets.length;
      let otherWidgetsTotal = 0;
      if (currentComp && containerWidth) {
        otherWidgetsTotal = widgets
          .filter((c) => c.id !== currentComp.id)
          .reduce((sum, c) => sum + c.width * containerWidth, 0);
      } else if (containerWidth) {
        otherWidgetsTotal = widgets.reduce(
          (sum, c) => sum + c.width * containerWidth,
          0
        );
      }
      const totalGaps = (numWidgets - 1) * gap;
      const totalWidgetPadding = numWidgets * widgetPadding;
      const totalParentPadding = parentPadding;
      const totalOccupied =
        totalGaps + totalWidgetPadding + totalParentPadding + otherWidgetsTotal;
      return totalOccupied;
    },
    [componentsList]
  );

  const onSectionDelete = (sectionId: string) => {
    setLayoutComponentsMap((prev) =>
      prev.filter((section) => section.id !== sectionId)
    );
    setComponentsList((prev) =>
      prev.filter((comp) => comp.sectionId !== sectionId)
    );
  };

  const onSave = () => {
    const savedDashboards = localStorage.getItem("saved-dashboards");

    if (savedDashboards) {
      const alreadyExists = JSON.parse(savedDashboards).some(
        (d: any) => d.name === canvasName
      );
      if (alreadyExists) {
        const parsed = JSON.parse(savedDashboards);
        const updatedDashboards = parsed.map((d: any) =>
          d.name === canvasName
            ? { ...d, layout: layoutComponentsMap, components: componentsList }
            : d
        );
        localStorage.setItem(
          "saved-dashboards",
          JSON.stringify(updatedDashboards)
        );
        messageApi.success("Dashboard updated");
      } else {
        const parsed = JSON.parse(savedDashboards);
        localStorage.setItem(
          "saved-dashboards",
          JSON.stringify([
            ...parsed,
            {
              name: canvasName,
              layout: layoutComponentsMap,
              components: componentsList,
            },
          ])
        );
        messageApi.success("Dashboard saved");
      }
    } else {
      localStorage.setItem(
        "saved-dashboards",
        JSON.stringify([
          {
            name: canvasName,
            layout: layoutComponentsMap,
            components: componentsList,
          },
        ])
      );
      messageApi.success("Dashboard saved");
    }
  };
  return (
    <>
      {contextHolder}
      <div className="text-lg font-bold text-center">Layout Builder</div>
      <div className="flex justify-center my-2">
        <Button onClick={onSave}>Save</Button>
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-2 my-2 justify-center mt-2">
          {widgetsComponents.map((widget) => (
            <Draggable key={widget.id} id={widget.id}>
              <div className="flex flex-col gap-2 justify-center text-center items-center w-24">
                {widget.icon}
                {widget.name}
              </div>
            </Draggable>
          ))}
        </div>
        <div className="text-center mb-2">Drag and drop widgets from here</div>
        <div className="flex flex-col">
          {layoutComponentsMap.map((section) => (
            <LayoutSection
              key={section.id}
              id={section.id}
              height={section.height}
              calculateOccupiedWidth={(containerWidth) =>
                calculateOccupiedWidth(section.id, undefined, containerWidth)
              }
              onDelete={onSectionDelete}
              isDragging={isDragging}
            >
              {(width) => (
                <>
                  {componentsList
                    .filter((comp) => comp.sectionId === section.id)
                    .sort((a, b) => a.order - b.order)
                    .map((comp) => (
                      <Draggable
                        id={comp.id}
                        key={comp.id}
                        setIsDragging={setIsDragging}
                      >
                        <ResizableWidget
                          key={comp.id}
                          height={section.height}
                          setHeight={section.setHeight}
                          width={comp.width * width}
                          setWidth={(newWidth: number) => {
                            setComponentsList((prev) =>
                              prev.map((c) =>
                                c.id === comp.id
                                  ? { ...c, width: newWidth / width }
                                  : c
                              )
                            );
                          }}
                          maxWidth={(() => {
                            const totalOccupied = calculateOccupiedWidth(
                              section.id,
                              comp,
                              width
                            );

                            const available = width - totalOccupied;
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
        {isDragging && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <TrashSection />
          </div>
        )}
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
};
