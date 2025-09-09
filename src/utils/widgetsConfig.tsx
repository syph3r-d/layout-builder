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
