import {
  Col,
  Row,
  Card,
  Space,
  AutoComplete,
  TreeSelect,
  message,
  Input,
  Button,
  Form,
  Divider,
  List,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import { ForceGraph3D } from "react-force-graph";
import InfiniteScroll from 'react-infinite-scroll-component';

const { Search } = Input;

export default function ShortestPath() {
  const treeData = [
    {
      title: "沙坪坝区",
      value: "沙坪坝区",
      children: [
        {
          title: "Child Node1",
          value: "0-0-1",
        },
        {
          title: "Child Node2",
          value: "0-0-2",
        },
      ],
    },
    {
      title: "Node2",
      value: "0-1",
    },
  ];

  const options = [
    { value: "Burns Bay Road" },
    { value: "Downing Street" },
    { value: "Wall Street" },
  ];
  //通过axios获取检索出来的节点信息
  const dataNodeFilter = [
    {
      title: "Ant Design Title 1",
    },
    {
      title: "Ant Design Title 2",
    },
    {
      title: "Ant Design Title 3",
    },
    {
      title: "Ant Design Title 4",
    },
  ];

  //高级检索信息
  const advancedRetrieval = [
    "领域",
    "地区",
    "水道",
    "商业区",
    "行政POI",
    "学校",
  ];

  const [form] = Form.useForm();

  const [regionValue, setRegionValue] = useState('');
  const [searchNodeValue, setSearchNodeValue] = useState<string>("");
  //use-react部分
  const fgRef = useRef<any>();
  //保存图数据
  const [graghData, setGraphData] = useState({});

  const onChange = (newValue: string) => {
    message.info(`图谱已经切换到${newValue}.`);
    setRegionValue(newValue);
    setTimeout(() => {
      console.log(regionValue);
    }, 500);
  };

  //通过搜索框进行搜索
  const onSearch = (value: string) => {
    console.log(value);
    setSearchNodeValue(value);
    setTimeout(() => {
      console.log(searchNodeValue);
    }, 500);
  };

  //高级筛选功能
  const getFields = () => {
    const count = 6;
    const children = [];
    for (let i = 0; i < count; i++) {
      children.push(
        <Col span={8} key={i}>
          <Form.Item
            name={`field-${advancedRetrieval[i]}`}
            label={`Field ${advancedRetrieval[i]}`}
            rules={[
              {
                required: true,
                message: "Input something!",
              },
            ]}
          >
            <Input placeholder="请输入您的选择" />
          </Form.Item>
        </Col>
      );
    }
    return children;
  };

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  //随机产生节点与边
  function genRandomTree(N = 300, reverse = false) {
    return {
      nodes: [...Array(N).keys()].map((i) => ({ id: i })),
      links: [...Array(N).keys()]
        .filter((id) => id)
        .map((id) => ({
          [reverse ? "target" : "source"]: id,
          [reverse ? "source" : "target"]: Math.round(Math.random() * (id - 1)),
        })),
    };
  }

  useEffect(() => {
    const data = genRandomTree(40);
    setGraphData(data);
  }, []);

  return (
    <>
      <Row>
        <Col span={12}>
          <Card title="请输入节点名查询" size="small">
            <Space.Compact block>
              <TreeSelect
                style={{ width: "150px" }}
                value={regionValue}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={treeData}
                placeholder="请选择重庆分区"
                treeDefaultExpandAll
                onChange={onChange}
              />
              <AutoComplete
                style={{ width: "300px", height: "100%" }}
                options={options}
                filterOption={(inputValue, option) =>
                  option!.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
              >
                <Search
                  allowClear
                  enterButton="Search"
                  size="large"
                  onSearch={onSearch}
                />
              </AutoComplete>
            </Space.Compact>
            <Divider />
            <Form
              form={form}
              name="advanced_search"
              className="ant-advanced-search-form"
              onFinish={onFinish}
            >
              <Row gutter={24}>{getFields()}</Row>
              <Row>
                <Col span={24} style={{ textAlign: "right" }}>
                  <Button type="primary" htmlType="submit">
                    Search
                  </Button>
                  <Button
                    style={{ margin: "0 8px" }}
                    onClick={() => {
                      form.resetFields();
                    }}
                  >
                    Clear
                  </Button>
                </Col>
              </Row>
            </Form>
            <Divider />
            <List
              itemLayout="horizontal"
              
              dataSource={dataNodeFilter}
              pagination
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href="#">{item.title}</a>}
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
          
              <ForceGraph3D
                ref={fgRef}
                width={700}
                height={650}
                nodeColor={()=>'pink'}
                backgroundColor	='white'
                graphData={genRandomTree(40)}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                linkCurvature={0.25}
                linkColor={()=>'black'}
              />
            
          </Card>
        </Col>
      </Row>
    </>
  );
}
