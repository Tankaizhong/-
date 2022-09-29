import { Chart, Data, NoFound, Content } from "@/pages";
import { Navigate } from "react-router-dom";
//路由模块
const routes = [
  {
    path: "/",
    element: <Navigate to="/content" />,
  },
  {
    path: "/content",
    element: <Content />,
    children: [
      {
        path: "",
        element: <Navigate to="data" />,
      },
      {
        path: "data",
        element: <Data />,
      },
      {
        path: "chart",
        element: <Chart />,
      },
    ],
  },
  {
    path: "*",
    element: <NoFound />,
  },
];
export default routes;
