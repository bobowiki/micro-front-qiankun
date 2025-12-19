import "./App.css";
import { Layout, Menu, Flex, Popover, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
const { Sider, Content, Header } = Layout;
const borderRadius = "8px";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
const backgroundColor = "#fff";

const menuList = [
  {
    setting: [
      {
        key: "/setting/micro-setting/app-setting/list",
        label: "app列表",
      },
      {
        key: "/setting/micro-setting/resource-setting/list",
        label: "资源列表",
      },
    ],
  },
  {
    kefu: [
      {
        key: "/kefu/micro-kefu/demo",
        label: "客服demo页面",
      },
    ],
  },
];

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuList, setMenuList] = useState([
    {
      setting: [
        {
          key: "/setting/micro-setting/app-setting/list",
          label: "app列表",
        },
        {
          key: "/setting/micro-setting/resource-setting/list",
          label: "资源列表",
        },
      ],
    },
    {
      kefu: [
        {
          key: "/kefu/micro-kefu/demo",
          label: "客服demo页面",
        },
      ],
    },
  ]);

  const appCode = location.pathname?.split("/")[1];

  const onClick = (e) => {
    navigate(e.key);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        theme="light"
        style={{
          borderRadius,
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
          backgroundColor,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Flex justify="space-between" align="center" style={{ width: "100%" }}>
          <Popover
            title="应用列表"
            trigger="click"
            placement="rightTop"
            content={
              <>
                <Button
                  type="link"
                  onClick={() => {
                    navigate("/setting");
                  }}
                >
                  setting
                </Button>
                <Button
                  type="link"
                  onClick={() => {
                    navigate("/kefu/micro-kefu/demo");
                  }}
                >
                  kefu
                </Button>
              </>
            }
          >
            <Button icon={<AppstoreOutlined />}></Button>
          </Popover>
          <SettingOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/setting");
            }}
          />
        </Flex>
      </Header>
      <Layout style={{ padding: "12px", gap: "12px" }}>
        <Sider
          theme="light"
          collapsible
          style={{ backgroundColor, borderRadius }}
          trigger={null}
        >
          <Menu
            onClick={onClick}
            mode="inline"
            style={{ height: "100%", borderRadius }}
            selectedKeys={[location.pathname]}
            items={menuList?.find((menu) => menu[appCode])[appCode]}
          />
        </Sider>
        <Content
          theme="light"
          style={{
            backgroundColor,
            padding: "12px",
            borderRadius,
          }}
        >
          <div id="subApp-viewport"></div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
