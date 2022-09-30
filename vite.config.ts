import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { join } from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      "@": join(__dirname, "./src"),
    },
    extensions: [".tsx", ".json", ".ts", ".js"], // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        out: false,
      },
    },
  },
});
