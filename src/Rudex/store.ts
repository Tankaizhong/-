import { configureStore } from "@reduxjs/toolkit";
import ChartSlice from "./Slice/LinkSlice";
import NodeSlice from "./Slice/NodeSlice";
//store顶层
export default configureStore({
  reducer: {
    chart: ChartSlice,
    node: NodeSlice,
  },
});
