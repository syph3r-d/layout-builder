import { ExpandAltOutlined } from "@ant-design/icons";
import React, { useState, type ReactNode, type ReactElement } from "react";
import { ResizableBox } from "react-resizable";

export const ResizableWidget = ({
  children: child,
  height,
  setHeight,
}: {
  children: ReactNode;
  height: number;
  setHeight?: (height: number) => void;
}) => {
  const [size, setSize] = useState({ width: 200 });

  const renderedChild = React.isValidElement(child)
    ? React.cloneElement(child as ReactElement, {
        //@ts-ignore
        width: size.width,
        height: height,
      })
    : child;

  return (
    <ResizableBox
      width={size.width}
      height={height}
      draggableOpts={{ enableUserSelectHack: false }}
      minConstraints={[100, 100]}
      maxConstraints={[600, 400]}
      onResize={(_, data) => {
        setSize({ width: data.size.width });
        if (setHeight) setHeight(data.size.height);
      }}
      className="relative p-4 "
      handle={
        <ExpandAltOutlined
          style={{
            cursor: "se-resize",
            position: "absolute",
            bottom: 0,
            right: 0,
            zIndex: 10,
          }}
        />
      }
    >
      {renderedChild}
    </ResizableBox>
  );
};
