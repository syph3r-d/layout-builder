import { ExpandAltOutlined } from "@ant-design/icons";
import React, { type ReactNode, type ReactElement } from "react";
import { ResizableBox } from "react-resizable";

export const ResizableWidget = ({
  children: child,
  height,
  width,
  setWidth,
  setHeight,
  maxWidth,
}: {
  children: ReactNode;
  height: number;
  width: number;
  setWidth: (width: number) => void;
  setHeight?: (height: number) => void;
  maxWidth: number;
}) => {
  const onSizeOverride = (size: { width: number; height: number }) => {
    if (setWidth) setWidth(size.width);
    if (setHeight) setHeight(size.height);
  };
  const renderedChild = React.isValidElement(child)
    ? React.cloneElement(child as ReactElement, {
        //@ts-ignore
        width: width,
        height: height,
        onSizeOverride: onSizeOverride,
      })
    : child;

  return (
    <ResizableBox
      width={width}
      height={height}
      draggableOpts={{ enableUserSelectHack: false }}
      minConstraints={[200, 100]}
      maxConstraints={[maxWidth, 400]}
      onResize={(_, data) => {
        if (setHeight) setHeight(data.size.height);
        if (setWidth) setWidth(data.size.width);
      }}
      className="relative p-4 overflow-auto"
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
