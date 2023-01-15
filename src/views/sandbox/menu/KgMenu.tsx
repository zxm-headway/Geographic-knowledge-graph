import {
  AppstoreOutlined,
  CalendarOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import type { MenuProps } from 'antd/es/menu';
import React, { useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('首页', '/home', <MailOutlined />),
  getItem('Search', '/home/kgsearch', <CalendarOutlined />),
  getItem('Navigation Two', 'sub1', <AppstoreOutlined />, [
    getItem('搜索图', '/home/searchgragh'),
    getItem('地点查询', '/home/classification'),
    getItem('Submenu', 'sub1-2', null, [getItem('Option 5', '5'), getItem('Option 6', '6')]),
  ]),
  getItem('算法', 'sub2', <SettingOutlined />, [
    getItem('知识图扩展', '/home/extensiongrangh'),
    getItem('更改图谱', '/home/domainmap'),
    getItem('实验性组件', '/home/trycoponent'),
    getItem('算法2', '10'),
    getItem('算法3', '11'),
    getItem('算法4', '12'),
  ]),

];

const KgMenu: React.FC = (props) => {

  const history = useHistory();
  const rootSubmenuKeys = ['sub1', 'sub2',];
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const onOpenChange = (keys: any) => {
    const latestOpenKey = keys.find((key: any) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const pageJump = (e: any) => {
    console.log(e.key)
    history.push(e.key);
  };
  // const [theme, setTheme] = useState<MenuTheme>('light');



  return (
    <>


      <Menu
        style={{ width: '100%' }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode={'inline'}
        theme={'dark'}
        items={items}
        onOpenChange={onOpenChange}
        openKeys={openKeys}
        onClick={(e) => {
          pageJump(e)
        }}
      />
    </>
  );
};

export default KgMenu;