import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { useSelector } from "react-redux";
import { ChartList } from "@/Rudex/Slice/LinkSlice";
import { NodeList } from "@/Rudex/Slice/NodeSlice";
import Item from "antd/lib/list/Item";
import { NodeType } from "../Data";
import { LinkType } from "../Data/Link";
export default function index() {
  const domRef = useRef<HTMLDivElement | null>(null);
  //绘图
  useEffect(() => {
    initEchart();
  }, []);
  const links = useSelector(ChartList).map((item: any) => {
    return {
      ...item,
    };
  });
  let data: number[] = [];
  //随机坐标生成
  useSelector(NodeList).forEach((element: any | LinkType) => {
    console.log(element);
    const NodeSource = useSelector(NodeList);
    // console.log(NodeSource);
    let map = new Map();
    NodeSource.map((item: NodeType) => {
      if (item.name === element.name) map.set(item.name, item.attribute);
    });
    // console.log(map);

    let i = 0;
    data.push({
      ...element,
      x: Math.random() * 2000,
      y: Math.random() * 1000,
      value: map.get(element.name),
    });
    console.log(data);
  });
  // console.log("links", links);

  const initEchart = () => {
    const myChart = echarts.init(domRef.current as unknown as HTMLElement);
    let option;
    option = {
      tooltip: {},
      // xAxis: {
      //   data: [1, 2, 3, 4],
      // },
      animationDurationUpdate: 1500,
      animationEasingUpdate: "quinticInOut",
      series: [
        {
          type: "graph",
          layout: "none",
          symbolSize: 50,
          roam: true,
          label: {
            show: true,
          },
          edgeSymbol: ["circle", "arrow"],
          edgeSymbolSize: [4, 10],
          edgeLabel: {
            fontSize: 20,
          },
          data, //数据
          links, //关系
          lineStyle: {
            opacity: 0.9,
            width: 2,
            curveness: 0,
          },
        },
      ],
    };
    option && myChart.setOption(option as any);
  };

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <div ref={domRef} style={{ height: "100%", width: "100%" }}></div>
    </div>
  );
}
