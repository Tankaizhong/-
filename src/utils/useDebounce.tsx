import React, { useRef } from "react";
import { delayTime } from "@/constant/idnex";
type Fn = (...args: any) => any;
//节流函数
export default function useDebounce(fn: Fn) {
  let timer: NodeJS.Timeout | null | undefined = null;
  let flag = true;
  return () => {
    //首次点击不适用节流
    if (flag) {
      fn();
      flag = false;
      return;
    }
    if (timer && !flag) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
    }, delayTime);
  };
}
