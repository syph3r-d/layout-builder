import React, { useEffect, useState } from "react";
import { Table as AntTable, Select } from "antd";
import { tableDataMap as dataMap } from "../../utils/data";

export const Table = ({
  height,
  width,
  onSizeOverride,
}: {
  height?: number;
  width?: number;
  onSizeOverride?: (size: { width: number; height: number }) => void;
}) => {
  const [selectedData, setSelectedData] = useState<string>(dataMap[0].id);
  useEffect(() => {
    console.log("Table rendered with size:", { height, width });

    if (onSizeOverride && height && width) {
      onSizeOverride({ height: 300, width: 600 });
    }
  }, []);
  return (
    <div className="px-2 overflow-auto min-w-96">
      <AntTable
        pagination={false}
        className="max-h-full "
        dataSource={
          dataMap.find((item) => item.id === selectedData)?.data?.data || []
        }
        columns={
          dataMap.find((item) => item.id === selectedData)?.data?.columns || []
        }
      />
      <div className="w-full flex justify-center mt-2">
        <Select
          value={selectedData}
          onChange={(value) => setSelectedData(value)}
        >
          {dataMap.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.id}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );
};
