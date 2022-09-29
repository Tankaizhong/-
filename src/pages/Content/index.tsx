import React from "react";
import { Button, Menu, Layout } from "antd";
import type { MenuProps } from "antd";
const { Header, Content, Sider } = Layout;
import menu from "@/menu"; //菜单项

import "./index.less"; //样式
import { useNavigate, Outlet } from "react-router-dom"; //路由
function Index() {
  //路由跳转
  const nav = useNavigate();
  const choose: MenuProps["onClick"] = ({ key }) => {
    nav(`${key}`);
  };
  return (
    <div>
      <Layout>
        <Header className="header"></Header>
        <Layout>
          <Sider theme="light" width={200} className="site-layout-background">
            <Menu mode="inline" onClick={choose} items={menu} theme="light" />
          </Sider>
          <Content className="left_Content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default Index;
