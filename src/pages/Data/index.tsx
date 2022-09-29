import React from "react";
import Link from "./Link";
import Node from "./Node";
import { useDispatch } from "react-redux";
import { removeRela } from "@/Rudex/Slice/LinkSlice";
import { removeNode } from "@/Rudex/Slice/NodeSlice";
import "./index.css";
import { AnyAction } from "@reduxjs/toolkit";
export interface NodeType {
  key: React.Key;
  name: string;
  attribute: string;
  note: string;
}
export default function index() {
  const dispatch = useDispatch();
  //删除
  const handleDelete = (key: React.Key & string, type: string) => {
    switch (type) {
      case "node":
        dispatch(removeNode(key) as unknown as AnyAction);
        break;
      default:
        dispatch(removeRela(key));
        break;
    }
  };
  //添加
  return (
    <div className="main_content">
      <Node dispatch={dispatch} handleDelete={handleDelete} />
      <Link dispatch={dispatch} handleDelete={handleDelete} />
    </div>
  );
}
