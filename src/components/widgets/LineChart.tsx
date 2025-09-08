import type { AlignedData, Options } from "uplot";
import UplotReact from "uplot-react";
import "uplot/dist/uPlot.min.css";
import { lineDataMap as dataMap } from "../../utils/data";
import { Select } from "antd";
import { useState } from "react";
const data: AlignedData = [
  [0, 1, 2, 3, 4, 5],
  [0, 5, 2, 2, 4, 5],
];

export const Chart = ({
  height,
  width,
}: {
  height?: number;
  width?: number;
}) => {
  const options: Options = {
    width: width || 200,
    height: height ? height - 100 : 140,
    scales: {
      x: {
        time: false,
        range: [-0.5, 5.5],
      },
      y: {},
    },
    axes: [{}],
    series: [
      {},
      {
        stroke: "blue",
      },
    ],
  };
  const [selectedData, setSelectedData] = useState<String>(dataMap[0].id);

  return (
    <>
      <UplotReact
        options={options}
        data={
          selectedData
            ? dataMap.find((d) => d.id === selectedData)?.data!
            : data
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
    </>
  );
};
