import type { AlignedData } from "uplot";

const data1: AlignedData = [
  [0, 1, 2, 3, 4, 5],
  [0, 5, 2, 2, 4, 5],
];

const data2: AlignedData = [
  [0, 1, 2, 3, 4, 5],
  [0, 4, 2, 3, 1, 5],
];

const data3: AlignedData = [
  [0, 1, 2, 3, 4, 5],
  [5, 3, 4, 2, 1, 0],
];

export const dataMap = [
  {
    id: "data1",
    data: data1,
  },
  {
    id: "data2",
    data: data2,
  },
  {
    id: "data3",
    data: data3,
  },
];
