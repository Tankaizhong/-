import { LinkType } from "@/pages/Data/Link";
import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";
import type { NodeType } from "@/pages/Data";
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
    removeRela: (state, { payload }) => {
      const tmp: any = [];
      state.forEach((element) => {
        if (element.key != payload) tmp.push(element);
      });
      return tmp;
    },
    addRela: (state, { payload }) => {
      // console.log(payload);
      state.unshift(payload);
    },
    refresh: (state, { payload }) => {
      return payload;
    },
  },
});

export const { removeRela, addRela, refresh } = ChartSlice.actions;
//关系表数据暴露
export const ChartList = (state: any) => {
  // console.log(state.chart)
  return state.chart;
};
export const updataRela = (cur: LinkType) => (dispatch: any, getState: any) => {
  const chartSource = ChartList(getState());
  let tmp: LinkType[] = [];
  chartSource.forEach((item: LinkType) => {
    if (item.key === cur.key) {
      tmp.push(cur);
    } else {
      tmp.push(item);
    }
  });
  dispatch(refresh(tmp));
};
export const checkNode =
  (nodeList: NodeType[]) => (dispatch: any, getState: any) => {
    const linkList = ChartList(getState());
    const data: string[] = [];
    nodeList.forEach((element: NodeType) => {
      data.push(element.name);
    });
    const tmp: LinkType[] = [];
    linkList.forEach((item: LinkType) => {
      if (data.includes(item.source) && data.includes(item.target)) {
        tmp.push(item);
      }
    });
    // console.log(tmp);
    dispatch(refresh(tmp));
  };
export default ChartSlice.reducer;
