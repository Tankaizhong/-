import React, { useState } from "react";
import Link from "./Link";
import Node from "./Node";
import {useDispatch } from "react-redux";
import { ChartList, removeChart } from "@/Rudex/Slice/ChartSlice";
import { removeNode } from "@/Rudex/Slice/NodeSlice";
import "./index.less";
export interface DataType {
  key: React.Key;
  name: string;
  attribute: string;
  note: string;
}
export default function index() {
  const dispatch = useDispatch();
  const [tmp, setSmp] = useState([] as DataType[]);
  const handleDelete = (key: React.Key, type: string) => {
    setSmp([]);
    switch (type) {
      case "node":
        dispatch(removeNode(key));
        break;
      default:
        dispatch(removeChart(key));
        break;
    }
  };
  return (
    <div>
      <Node handleDelete={handleDelete} />
      <Link handleDelete={handleDelete} />
    </div>
  );
}
