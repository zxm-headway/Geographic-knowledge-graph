import {
  MenuFoldOutlined,
  UserOutlined,
  MenuUnfoldOutlined,

  AlignCenterOutlined,
} from '@ant-design/icons';
import { Layout, Space, Dropdown, Avatar, Menu, Button } from 'antd';
import styled from './Sandbox.module.css'
import React, { useState } from 'react';
import SandboxRouter from './SandboxRouter/SandboxRouter'
import KgMenu from './menu/KgMenu';
import { useHistory } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const Sandbox: React.FC = () => {
  const history = useHistory()
  const [collapsed, setCollapsed] = useState(false);
  const menu: any = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            '超级管理员'
          ),
        },

        {
          key: '2',
          label: (
            <Button danger type='primary' onClick={() => { history.push('/login') }}>退出</Button>
          ),

        },
      ]}
    />
  );


  return (
    <Layout className={styled.all}>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className={styled.logo}>{collapsed ? <AlignCenterOutlined /> : '时空地理知识图谱系统'}</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <KgMenu></KgMenu>
        </div>

      </Sider>
      <Layout className={styled.sitelayout}>
        <Header className={styled.sitelayoutbackground} style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: styled.trigger,
            onClick: () => setCollapsed(!collapsed),
          })}
          <div style={{ float: 'right', marginRight: '100px' }}>
            <Space align='center' size={'small'}>
              <span>欢迎您的到来！</span>
              <Dropdown menu={menu} placement="bottomRight" arrow>
                <Avatar size={40} icon={<UserOutlined />} />
              </Dropdown>
            </Space>

          </div>
        </Header>
        <Content
          className={styled.sitelayoutbackground}
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: "auto"
          }}
        >
          <SandboxRouter></SandboxRouter>
        </Content>
      </Layout>
    </Layout>
  );
};





export default Sandbox;

