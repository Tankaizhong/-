import { createSlice } from "@reduxjs/toolkit";
import { NodeData } from "@/Rudex/Slice/data";
// 1. 初始化数据
const initialState = NodeData;

export const NodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    removeNode: (state, { payload }) => {
      const tmp: any = [];
      state.forEach((element: { key: any }) => {
        if (element.key != payload) tmp.push(element);
      });
      return tmp;
    },
    addNode: (state, { payload }) => {
      state.push(payload);
    },
    updateNode: (state, action) => {
      let tmp: any[] = [];
      let { ...data } = action.payload;
      state.forEach((item) => {
        if (item.key === data.key) {
          tmp.push(data);
        } else {
          tmp.push(item);
        }
      });
      return tmp;
    },
  },
});
export const { removeNode, addNode, updateNode } = NodeSlice.actions;
//节点信息暴露
export const NodeList = (state: any) => {
  return state.node;
};
export default NodeSlice.reducer;
