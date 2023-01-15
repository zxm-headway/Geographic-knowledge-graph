import React, { useState } from 'react'
import { observer } from "mobx-react";
import styled from 'styled-components';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, MenuProps } from 'antd';
import { Dropdown, message, Space, AutoComplete, Input, TreeSelect, Card, Typography } from 'antd';
import DomainGragh from '../PagesComponent/DomainGragh';
import { Graph } from '@antv/g6';

const { Search } = Input;
const { Text } = Typography;




const treeData = [
  {
    title: '沙坪坝区',
    value: '沙坪坝区',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
  },
];



const options = [
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
];



const DomainMap: React.FC = observer(() => {

  const [regionValue, setRegionValue] = useState<string>();
  const [searchNodeValue, setSearchNodeValue] = useState<string>()

  //设置是否打开抽屉框的参数
  const [openDrawer, setOpenDrawer] = useState(false);

  const onChange = (newValue: string) => {
    message.info(`图谱已经切换到${newValue}.`);
    setRegionValue(newValue);
  };


  const onSearch = (value: string) => {
    console.log(value)
    setSearchNodeValue(value)


  };



  //打开抽屉框
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  //关闭抽屉框
  const onClose = () => {
    setOpenDrawer(false);
  };




  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}  >
      <Space.Compact block>
        <TreeSelect
          style={{ width: '150px' }}
          value={regionValue}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="请选择重庆分区"
          treeDefaultExpandAll
          onChange={onChange}

        />
        <AutoComplete
          style={{ width: '300px', height: '100%' }}
          options={options}
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }>
          <Search
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />

        </AutoComplete>
      </Space.Compact>

      <Card size="small" title={<Typography.Title level={4} >当前的地区图谱:<Text code>{regionValue}</Text><Button type='primary' onClick={() => { showDrawer() }}>点击查看所选信息</Button></Typography.Title>} bordered={false} style={{ width: '100%' }}>
        <div style={{ width: "100%" }}>
          <DomainGragh searchNodeName={searchNodeValue} regionNode={regionValue} opean={showDrawer} closeDrawer={onClose} isDrawer={openDrawer}></DomainGragh>
        </div>
      </Card>
    </Space>
  );
})



export default DomainMap
