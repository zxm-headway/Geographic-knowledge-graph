import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  
  AlignCenterOutlined,
} from '@ant-design/icons';
import { Layout} from 'antd';
import styled from './Sandbox.module.css'
import React, { useState } from 'react';
import SandboxRouter from './SandboxRouter/SandboxRouter'
import KgMenu from './menu/KgMenu';

const { Header, Sider, Content } = Layout;

const Sandbox: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className={styled.all}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className={styled.logo}>{collapsed?<AlignCenterOutlined /> :'时空地理知识图谱系统'}</div>
        <KgMenu></KgMenu>
      </Sider>
      <Layout className={styled.sitelayout}>
        <Header className={styled.sitelayoutbackground} style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: styled.trigger,
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          className={styled.sitelayoutbackground}
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
         <SandboxRouter></SandboxRouter>
        </Content>
      </Layout>
    </Layout>
  );
};





export default Sandbox;

