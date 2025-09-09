import { Tabs } from "antd";
import { Canvas } from "./components/Canvas";
import { useRef, useState } from "react";
import { dashboardTemplates } from "./utils/widgetsConfig";

export default function App() {
  type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

  const initialItems = [
    {
      label: "Example Dashboard",
      children: (
        <Canvas
          initialLayout={dashboardTemplates[0].layout}
          initialComponentList={dashboardTemplates[0].components}
        />
      ),
      key: "1",
    },
    {
      label: "Empty Dashboard",
      children: <Canvas initialLayout={[]} initialComponentList={[]} />,
      key: "2",
    },
  ];
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: "New Dashboard",
      children: <Canvas initialLayout={[]} initialComponentList={[]} />,
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
    />
  );
}
