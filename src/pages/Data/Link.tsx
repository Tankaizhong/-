import { Button, Table } from "antd";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChartList, removeChart } from "@/Rudex/Slice/ChartSlice";
export default function Link(props: any) {
  const { handleDelete } = props;
  const ChartSource = useSelector(ChartList);
  let ChartCol = [
    {
      title: "起点",
      dataIndex: "source",
      key: "source",
      editable: true,
    },
    {
      title: "终点",
      dataIndex: "target",
      key: "target",
      editable: true,
    },
    {
      title: "删除",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        return ChartSource.length >= 1 ? (
          <Button danger onClick={() => handleDelete(record.key, "chart")}>
            删除
          </Button>
        ) : null;
      },
    },
  ];
  return (
    <>
      <Button type="primary" style={{ float: "right" }}>
        添加关系
      </Button>
      <Table size="small" columns={ChartCol} dataSource={ChartSource} />
    </>
  );
}
