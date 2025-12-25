import { useState } from 'react';
import { Divider, Layout, Menu } from 'antd';
const { Sider, Content } = Layout;
function MicroLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        theme="light"
        collapsed={collapsed}
        collapsible
        width={260}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div>我是logo</div>
        <Divider />
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: '/setting/micro-setting/app-setting/list',
              label: 'app列表',
            },
            {
              key: '/setting/micro-setting/resource-setting/list',
              label: '资源列表',
            },
          ]}
        />
      </Sider>
      <Content
        style={{
          padding: '12px',
        }}
      >
        <div id="subApp-viewport"></div>
      </Content>
    </Layout>
  );
}

export default MicroLayout;
