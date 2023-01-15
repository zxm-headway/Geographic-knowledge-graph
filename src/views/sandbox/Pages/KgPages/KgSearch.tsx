import React, { useState } from "react";
import { Input, Card, Collapse, Space, Divider, List, Typography, Popover, Button, AutoComplete } from "antd";
import { EntitySelector } from "../../../../component/homeIndex/Search/EntitySelector";
import { SwapOutlined } from '@ant-design/icons'
import styled from "styled-components";
import { FilterStore } from "../../../../component/homeIndex/context/MobxStore";
import '../css/searchListcss.module.css'
const { Search } = Input;

const data = Array.from({ length: 23 }).map((_, i) => ({
  href: "#/home/classification",
  title: `ant design part ${i}`,
  description:
    "Ant Design, a design language for background applications, is refined by Ant UED Team.",
  content:
    "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
}));

export const SearchContainer = styled.div`
  
  border-radius: 6px;

  
`;


const onSearch = (value: string) => console.log(value);



export default function KgSearch() {
  const [open, setOpen] = useState(false);

  const options = [
    { value: 'Burns Bay Road' },
    { value: 'Downing Street' },
    { value: 'Wall Street' },
  ];

  const content = (
    <Space direction="vertical" size="middle" style={{ display: 'flex', textAlign: 'center' }}>
      <Button ghost style={{ color: '#000' }} onClick={() => { hide() }}>按相关性</Button>
      <Button ghost style={{ color: '#000' }} onClick={() => { hide() }}>按相关性</Button>
      <Button ghost style={{ color: '#000' }} onClick={() => { hide() }}>按相关性</Button>
      <Button ghost style={{ color: '#000' }} onClick={() => { hide() }}>按相关性</Button>
    </Space>
  );


  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  return (
    <div>
      <Card style={{ width: "100%" }} bordered={false} >
        <SearchContainer>
          <Space.Compact block>
            <EntitySelector border style={{ width: '200px', backgroundColor: '#fff', height: '100%', marginLeft: "20px", }} size="large" />

            <AutoComplete
              style={{ width: '550px', height: '100%' }}
              options={options}

              filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }>

              <Search
                placeholder={FilterStore.keyword}
                allowClear
                enterButton="Search"
                size="large"
                onSearch={onSearch}


              />

            </AutoComplete>
          </Space.Compact>


        </SearchContainer>

        <Divider />



        <Card style={{ marginTop: "20px", }} bordered={false} title={<Typography.Title level={3} >查询实体相关概念{<span>(33)</span>}</Typography.Title>} extra={<div style={{ clear: 'both' }}> <Popover placement="bottom" content={content} trigger="click" open={open}
          onOpenChange={handleOpenChange}>
          <Button type="primary" shape="round" icon={<SwapOutlined />}>排序方式</Button>
        </Popover> </div>} >
          <List
            itemLayout="vertical"
            size="large"
            pagination={{

              onChange: (page) => {
                console.log(page);
              },
              pageSize: 5,

            }}
            dataSource={data}

            renderItem={(item) => (
              <Card style={{ marginTop: "20px" }} hoverable>
                <List.Item
                  key={item.title}

                  extra={
                    <span style={{}} ><a>点击查看详情</a> </span>
                  }
                >
                  <List.Item.Meta
                    // avatar={<Avatar src={item.avatar} />}
                    title={<a href={item.href}><Typography.Title level={4}>{item.title}</Typography.Title></a>}
                    description={<u>{item.description}</u>}
                  />
                  {item.content}
                </List.Item>
              </Card>
            )}
          />
        </Card>
      </Card>
    </div>
  );
}
