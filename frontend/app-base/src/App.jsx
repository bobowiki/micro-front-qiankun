import { Layout, Menu, Flex, Popover, Button, ConfigProvider, ColorPicker, theme } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import { registerMicroApps, start, initGlobalState } from 'qiankun';
import request from '../utils/request';

const actions = initGlobalState({
  theme: {
    colorPrimary: '#00b96b',
  },
});

const backgroundColor = '#fff';
const borderRadius = '8px';
const { Sider, Content, Header } = Layout;

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState({
    colorPrimary: '#00b96b',
  });

  useEffect(() => {
    request.get('/app/config').then((res) => {
      const { data } = res;
      const demo = {
        name: 'demo',
        entry: {
          scripts: [
            'http://localhost:3003/static/js/manifest.js',
            'http://localhost:3003/static/js/index.js',
          ],
          styles: ['http://localhost:3003/static/css/index.css'],
        },
        activeRule: ['/demo/micro-demo/home'],
      };
      registerMicroApps(
        [...data, demo]?.map((item) => {
          return {
            name: item.name,
            entry: {
              scripts: item.entry.scripts,
              styles: item.entry.styles,
              html: `<div id="appsub"></div>`,
            },
            container: '#subApp-viewport',
            activeRule: item.activeRule,
            props: {
              actions, // 传给子应用
            },
          };
        })
      );
      start({
        prefetch: true,
      });
    });
  }, []);

  useEffect(() => {
    actions.setGlobalState({
      theme: {
        colorPrimary: theme.colorPrimary,
      },
    });
  }, [theme]);

  const [menuList, setMenuList] = useState([
    {
      setting: [
        {
          key: '/setting/micro-setting/app-setting/list',
          label: 'app列表',
        },
        {
          key: '/setting/micro-setting/resource-setting/list',
          label: '资源列表',
        },
      ],
    },
    {
      kefu: [
        {
          key: '/kefu/micro-kefu/demo',
          label: '客服demo页面',
        },
      ],
    },
  ]);

  const appCode = location.pathname?.split('/')[1];

  const onClick = (e) => {
    navigate(e.key);
  };

  return (
    <ConfigProvider
      theme={{
        // algorithm: dark ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: theme.colorPrimary,
          colorLink: theme.colorPrimary,
        },
      }}
    >
      <Layout style={{ height: '100vh' }}>
        <Header
          theme="light"
          style={{
            borderRadius,
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Flex justify="space-between" align="center" style={{ width: '100%' }}>
            <Popover
              title="应用列表"
              trigger="click"
              placement="rightTop"
              content={
                <>
                  <Button
                    type="link"
                    onClick={() => {
                      navigate('/setting');
                    }}
                  >
                    setting
                  </Button>
                  <Button
                    type="link"
                    onClick={() => {
                      navigate('/kefu/micro-kefu/demo');
                    }}
                  >
                    kefu
                  </Button>
                </>
              }
            >
              <Button icon={<AppstoreOutlined />}></Button>
            </Popover>
            {/* <SettingOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/setting');
              }}
            /> */}
            <ColorPicker
              value={theme.colorPrimary}
              onChange={(color) => {
                // console.log('color', color);
                setTheme({
                  colorPrimary: color.toHexString(),
                });
              }}
            />
            <Button icon={<AppstoreOutlined />}>切换</Button>
          </Flex>
        </Header>
        <Layout style={{ padding: '12px', gap: '12px' }}>
          <Sider theme="light" collapsible style={{ backgroundColor, borderRadius }} trigger={null}>
            <Menu
              onClick={onClick}
              mode="inline"
              style={{ height: '100%', borderRadius }}
              selectedKeys={[location.pathname]}
              items={menuList?.find((menu) => menu[appCode])?.[appCode]}
            />
          </Sider>
          <Content
            theme="light"
            style={{
              backgroundColor,
              padding: '12px',
              borderRadius,
            }}
          >
            <div id="subApp-viewport"></div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
