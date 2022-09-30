import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { useSelector } from "react-redux";
import { ChartList } from "@/Rudex/Slice/LinkSlice";
import { NodeList } from "@/Rudex/Slice/NodeSlice";
export default function index() {
  const domRef = useRef<HTMLDivElement | null>(null);
  //绘图
  useEffect(() => {
    initEchart();
  }, []);
  let data: number[] = [];
  //随机坐标生成
  useSelector(NodeList).forEach((element: any) => {
    data.push({
      ...element,
      x: Math.random() * 1100,
      y: Math.random() * (Math.random() * 2000),
    });
  });
  const links = useSelector(ChartList);
  const initEchart = () => {
    const myChart = echarts.init(domRef.current as unknown as HTMLElement);
    let option;
    option = {
      tooltip: {},
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
