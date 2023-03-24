import React, { useEffect, useState } from 'react'
import { observer } from "mobx-react";
// import styled from 'styled-components';
// import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button} from 'antd';
import {  message, Space, AutoComplete, Input, TreeSelect, Card, Typography } from 'antd';
// import DomainGragh from '../PagesComponent/DomainGragh';
import D3 from "./D3"
// import axios from 'axios';
// import data from "../../../../mockDate/miserables.json";


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
  {value:'重庆市人民政府'},
  {value:'重庆师范大学'},
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
];



const D3Main: React.FC = observer(() => {

  const [regionValue, setRegionValue] = useState<string>('沙坪坝区');
  const [searchNodeValue, setSearchNodeValue] = useState<string>('')

  //设置是否打开抽屉框的参数
  const [openDrawer, setOpenDrawer] = useState(false);
  //发起axios请求，获取所需数据，并将其保存下来
  // const [GraphData,setGraphData] = useState<any>({})

  const onChange = (newValue: string) => {
    message.info(`图谱已经切换到${newValue}.`);
    setRegionValue(newValue);
    setTimeout(() => {
      console.log(regionValue)
    }, 500);
  };

  //通过搜索框进行搜索
  const onSearch = (value: string) => {
    console.log(value)
    setSearchNodeValue(value)
    setTimeout(() => {
      console.log(searchNodeValue)
    }, 500);

  };

  //打开抽屉框
  const showDrawer = () => {
    setOpenDrawer(true);
  };

  //关闭抽屉框
  const onClose = () => {
    setOpenDrawer(false);
  };


  useEffect(
    // ()=>{
    // // 发起axios请求获取数据，然后对数据进行分析
    // console.log('页面进行了一次更新')
    // axios.get('../../../../mockDate/miserables.json',{
    //   method:'GET',
    // }).then(data => {
    //   console.log(data)
    //   setGraphData(data)
    //   setTimeout(() => {
    //     console.log(GraphData)
    //   }, 500);
      // setGraphData(data)
  ()=>{
    console.log('页面更新了一次')
  }
  ,[searchNodeValue,openDrawer,regionValue])

  return (
    <>
    <Space direction="horizontal" size="large" style={{ display: 'flex' }}  >
      <Space.Compact block>
        <TreeSelect
          style={{ width: '150px' }}
          defaultValue={regionValue}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="请选择重庆分区"
          treeDefaultExpandAll
          onChange={onChange}

        />
        <AutoComplete
          style={{ width: '300px', height: '100%' }}
          options={options}
          defaultActiveFirstOption
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }>
          <Search
            allowClear
            enterButton="Search"
            size="large"
            // defaultValue={'重庆市人民政府'}
            onSearch={onSearch}
          />

        </AutoComplete>

      </Space.Compact>
      <Button type='primary' onClick={() => { showDrawer() }}>点击查看所选信息</Button>
      <Text >当前的地区图谱:<Text mark>{regionValue}</Text></Text>
      </Space>

      <Card size="small"  bordered={false} >
        
          <D3 searchNodeName={searchNodeValue} regionNode={regionValue} opean={showDrawer} closeDrawer={onClose} isDrawer={openDrawer}></D3>
        
      </Card>
      </>
  );
})



export default D3Main
