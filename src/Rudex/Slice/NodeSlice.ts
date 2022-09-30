import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { NodeData } from "@/Rudex/Slice/data";
import { NodeType } from "@/pages/Data";
import { Key } from "react";
import { checkNode } from "./LinkSlice";
// 1. 初始化数据
const initialState = NodeData;
export const NodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    addNode: (state, { payload }) => {
      state.unshift(payload);
    },
    refresh: (state, { payload }) => {
      return payload;
    },
  },
});
// actions暴露
export const { addNode, refresh } = NodeSlice.actions;
//节点信息暴露
export const NodeList = (state: any) => {
  return state.node;
};
export const updateNode =
  (curdata: NodeType) => (dispatch: any, getState: any) => {
    const chartSource = NodeList(getState());
    let tmp: any[] = [];
    let { ...data } = curdata;
    chartSource.forEach((item: { key: Key }) => {
      if (item.key === data.key) {
        tmp.push(data);
      } else {
        tmp.push(item);
      }
    });
    dispatch(refresh(tmp));
  };
export const removeNode =
  (curKey: string) => (dispatch: any, getState: any) => {
    const NodeSource: NodeType[] = NodeList(getState());
    let tmp: any[] = [];
    for (let index = 0; index < NodeSource.length; index++) {
      const element = NodeSource[index];
      if (element.key != curKey) tmp.push(element);
    }
    dispatch(checkNode(tmp)); //更新关系表
    dispatch(refresh(tmp)); //更新节点表
  };
export default NodeSlice.reducer;
