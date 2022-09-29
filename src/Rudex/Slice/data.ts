//初始化数据
import { nanoid } from "nanoid";
const NodeData: any[] = [];
const map = new Map();
for (let i = 0; i < 4; i++) {
  NodeData.push({
    key: nanoid(),
    name: `${String.fromCharCode(65 + i)}`,
    attribute: `${i}`,
    note: `London Park no. ${i}`,
  });
}
const ChartData: any[] = [
  {
    key: nanoid(),
    source: "A",
    target: "B",
  },
  {
    key: nanoid(),
    source: "B",
    target: "C",
  },
  {
    key: nanoid(),
    source: "C",
    target: "D",
  },
];
export { NodeData, ChartData };
