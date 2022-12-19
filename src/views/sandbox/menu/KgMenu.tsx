import {
  AppstoreOutlined,
  CalendarOutlined,
  MailOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useHistory } from 'react-router-dom';
import type { MenuProps } from 'antd/es/menu';
import React from 'react';

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
    getItem('Option 4', '4'),
    getItem('Submenu', 'sub1-2', null, [getItem('Option 5', '5'), getItem('Option 6', '6')]),
  ]),
  getItem('Navigation Three', 'sub2', <SettingOutlined />, [
    getItem('Option 7', '7'),
    getItem('Option 8', '8'),
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
  ]),

];

const KgMenu: React.FC = (props) => {
  
  const history = useHistory();

  const pageJump  = (e:any) => {
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
        onClick={(e)=>{
          pageJump(e)
        }}
      />
    </>
  );
};

export default KgMenu;