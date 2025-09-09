import {
  LineChartOutlined,
  BarChartOutlined,
  TableOutlined,
} from "@ant-design/icons";
import Barchart from "../components/widgets/BarChart";
import { Chart } from "../components/widgets/LineChart";
import { Table } from "../components/widgets/Table";

export const widgetsComponents = [
  {
    name: "Line Chart",
    component: <Chart />,
    icon: (
      <LineChartOutlined
        style={{
          fontSize: "24px",
        }}
      />
    ),
    id: "base-line-chart",
  },
  {
    name: "Bar Chart",
    component: <Barchart />,
    icon: (
      <BarChartOutlined
        style={{
          fontSize: "24px",
        }}
      />
    ),
    id: "base-bar-chart",
  },
  {
    name: "Table",
    component: <Table />,
    icon: (
      <TableOutlined
        style={{
          fontSize: "24px",
        }}
      />
    ),
    id: "base-table",
  },
];

export const dashboardTemplates = [
  {
    id: "template1",
    components: [
      {
        id: "12ccea85-a55e-4e53-aa3e-6cab77db6386",
        component: <Chart />,
        width: 863,
        sectionId: "11d76512-125f-4985-86df-fcfd1c632dfc",
        order: 0,
      },
      {
        id: "4a1edf2d-1404-47d9-a9d0-821c6272d028",
        component: <Barchart />,
        width: 661,
        sectionId: "11d76512-125f-4985-86df-fcfd1c632dfc",
        order: 1,
      },
      {
        id: "39484c77-f46a-4c5d-ad57-82ebc9369148",
        component: <Chart />,
        width: 432,
        sectionId: "a5c97999-56f2-4871-8ebd-f252e9192707",
        order: 0,
      },
      {
        id: "5f31967c-2ba3-4653-a858-ce4a0eae6098",
        component: <Table />,
        width: 600,
        sectionId: "a5c97999-56f2-4871-8ebd-f252e9192707",
        order: 1,
      },
      {
        id: "a37fa6a5-bb2c-4fc6-b754-007aad8e4364",
        component: <Barchart />,
        width: 692,
        sectionId: "a5c97999-56f2-4871-8ebd-f252e9192707",
        order: 2,
      },
    ],
    layout: [
      {
        id: "11d76512-125f-4985-86df-fcfd1c632dfc",
        height: 305,
      },
      {
        id: "a5c97999-56f2-4871-8ebd-f252e9192707",
        height: 303,
      },
    ],
  },
];
