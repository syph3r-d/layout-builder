import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { barDataMap as dataMap } from "../../utils/data";
import { Select } from "antd";

const Barchart = ({ height, width }: { height?: number; width?: number }) => {
  const ref = useRef(null);
  const [selectedData, setSelectedData] = useState<String>(dataMap[0].id);

  useEffect(() => {
    if (!height || !width) return;
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom - 30;

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3
      .scaleBand()
      .range([0, chartWidth])
      .domain(
        dataMap.find((d) => d.id === selectedData)?.data.map((d) => d.title) ??
          []
      )
      .padding(0.2);
    svg
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleLinear().domain([0, 100]).range([chartHeight, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    svg
      .selectAll("mybar")
      .data(dataMap.find((d) => d.id === selectedData)?.data ?? [])
      .join("rect")
      .attr("x", (d) => x(d.title) ?? 0)
      .attr("y", (d) => y(d.value) ?? 0)
      .attr("width", x.bandwidth())
      .attr("height", (d) => chartHeight - (y(d.value) ?? 0))
      .attr("fill", "blue");
  }, [height, width, selectedData]);

  return (
    <div className="flex flex-col gap-2 h-full">
      <svg
        id="barchart"
        ref={ref}
        style={{ width: "100%", display: "block" }}
      />
      <div className="w-full flex justify-center mt-2">
        <Select
          defaultValue={selectedData}
          onChange={(value) => setSelectedData(value)}
          options={dataMap.map((d) => ({ label: d.id, value: d.id }))}
        />
      </div>
    </div>
  );
};

export default Barchart;
