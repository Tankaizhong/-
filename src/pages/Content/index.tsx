import { Menu, Layout, Avatar } from "antd";
import type { MenuProps } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
const { Header, Content, Sider } = Layout;
import menu, { defaultArr } from "@/constant/menu"; //菜单项
import "./index.css"; //样式
import { useNavigate, Outlet, useLocation } from "react-router-dom"; //路由
import { useEffect } from "react";
function Index() {
  //点击进行对应的路由跳转
  const nav = useNavigate();
  const choose: MenuProps["onClick"] = ({ key }) => {
    nav(`${key}`);
  };
  //检查路由重定向到对应的界面
  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== defaultArr[0]) {
      nav(defaultArr[0]);
    }
  }, []);
  return (
    <div>
      <Layout>
        <Header className='site-layout-sub-header-background'>
          <h3>首页</h3>
          <Avatar
            style={{ backgroundColor: "#1890ff" }}
            icon={<AntDesignOutlined />}
          />
        </Header>
        <Layout>
          <Sider theme='light' width={"20%"} className='site-layout-background'>
            <Menu
              mode='inline'
              onClick={choose}
              defaultSelectedKeys={defaultArr}
              items={menu}
              theme='light'
            />
          </Sider>
          <Content className='left_Content'>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default Index;
