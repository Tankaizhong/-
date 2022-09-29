import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";
const initialState = [
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

export const ChartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    removeChart: (state, { payload }) => {
      const tmp: any = [];
      state.forEach((element) => {
        if (element.key != payload) tmp.push(element);
      });
      return tmp;
    },
  },
});

export const { removeChart } = ChartSlice.actions;
//关系表数据暴露
export const ChartList = (state: any) => {
  return state.chart;
};
export default ChartSlice.reducer;
