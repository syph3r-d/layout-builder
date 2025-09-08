import type { AlignedData } from "uplot";

interface BarChartData {
  title: string;
  value: number;
}

const lineData1: AlignedData = [
  [0, 1, 2, 3, 4, 5],
  [0, 5, 2, 2, 4, 5],
];

const lineData2: AlignedData = [
  [0, 1, 2, 3, 4, 5],
  [0, 4, 2, 3, 1, 5],
];

const lineData3: AlignedData = [
  [0, 1, 2, 3, 4, 5],
  [5, 3, 4, 2, 1, 0],
];

const barData1: BarChartData[] = [
  { title: "A", value: 30 },
  { title: "B", value: 80 },
  { title: "C", value: 45 },
  { title: "D", value: 60 },
];

const barData2: BarChartData[] = [
  { title: "A", value: 20 },
  { title: "B", value: 90 },
  { title: "C", value: 50 },
  { title: "D", value: 70 },
];

const barData3: BarChartData[] = [
  { title: "A", value: 25 },
  { title: "B", value: 85 },
  { title: "C", value: 55 },
  { title: "D", value: 65 },
];

export const lineDataMap = [
  {
    id: "data1",
    data: lineData1,
  },
  {
    id: "data2",
    data: lineData2,
  },
  {
    id: "data3",
    data: lineData3,
  },
];

export const barDataMap = [
  {
    id: "data1",
    data: barData1,
  },
  {
    id: "data2",
    data: barData2,
  },
  {
    id: "data3",
    data: barData3,
  },
];
