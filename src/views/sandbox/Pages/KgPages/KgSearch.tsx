import React, { useState } from "react";
import {
  Input,
  Card,
  Space,
  Divider,
  List,
  Typography,
  Popover,
  Button,
  AutoComplete,
  Tag,
  Row,
  Col,
  BackTop,
} from "antd";
import { EntitySelector } from "../../../../component/homeIndex/Search/EntitySelector";
import { SwapOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { FilterStore } from "../../../../component/homeIndex/context/MobxStore";
import { AlgorithmSetting } from "../../../../component/homeIndex/AlgorithmSetting";
import "../css/searchListcss.module.css";
const { Search } = Input;

const dataMock = Array.from({ length: 18 }).map((_, i) => ({
  href: "#/home/classification",
  title: `ant design part ${i}`,
  description:
    "Ant Design, a design language for background applications, is refined by Ant UED Team.",
  content:
    "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
}));

let forwardData = [
  {
    href: "#/home/classification",
    title: "西南大学",
    description: "中国重庆市境内教育部直属高校",
    content:
      "西南大学（Southwest University），主体位于重庆市北碚区，是中华人民共和国教育部直属，农业农村部、重庆市共建的全国重点大学。 [1]  位列国家“双一流”、 [110]  “211工程”、“985工程优势学科创新平台”建设高校、“双一流”农科联盟成员高校。 [2]  入选“111计划”、“2011计划”、“百校工程”、卓越农林人才教育培养计划、卓越教师培养计划、国家大学生创新性实验计划、国家级大学生创新创业训练计划、国家建设高水平大学公派研究生项目、国家大学生文化素质教育基地、中国政府奖学金来华留学生接收院校。",
  },
  {
    href: "#/home/classification",
    title: "重庆师范大学",
    description: "中国重庆市境内公办高校",
    content:
      "重庆师范大学（Chongqing Normal University），简称“重庆师大”，位于中国直辖市重庆，国家“中西部高校基础能力建设工程”实施高校， [1]  入选首批“卓越农林人才教育培养计划、卓越教师培养计划”，“马云乡村师范生计划”首批合作院校，全国毕业生就业典型经验高校，重庆市一流学科建设高校，是一所以教师教育为特色、多学科协调发展的综合性师范大学。",
  },
  {
    href: "#/home/classification",
    title: "重庆大学",
    description: "中国重庆市境内公办高校",
    content:
      "重庆大学（ChongqingUniversity，CQU），简称重大，是中华人民共和国教育部直属，由教育部、重庆市、国家国防科技工业局共建的全国重点大学，位列国家“双一流”、“211工程”、”985工程”，入选“珠峰计划”、“强基计划 [177]  ”、“高等学校创新能力提升计划”、“高等学校学科创新引智计划”、“卓越工程师教育培养计划”、“卓越法律人才教育培养计划”、国家建设高水平大学公派研究生项目、中国政府奖学金来华留学生接收院校、教育部来华留学示范基地，为卓越大学联盟、中波大学联盟、一带一路高校联盟、“长江—伏尔加河”高校联盟、CDIO工程教育联盟、中国高等戏剧教育联盟成员单位。",
  },
  {
    href: "#/home/classification",
    title: "西南政法大学",
    description: "中国重庆市境内公办全国重点大学",
    content:
      "西南政法大学（Southwest University of Political Science & Law），简称“西政”，位于重庆市，是新中国最早建立的政法类高等学府，改革开放后国务院确定的全国首批全国重点大学，教育部和重庆市人民政府共建高校，国家首批卓越法律人才教育培养计划基地，中国政府奖学金来华留学生接收院校，中西部高校基础能力建设工程；是首批国家大学生文化素质教育基地，国家建设高水平大学公派研究生项目、国家特色重点学科项目、新工科研究与实践项目、国家级大学生创新创业训练计划实施高校，自主招生试点高校。重庆市一流学科建设高校，以法学为主，经济学、文学、管理学、哲学、工学等多学科协调发展，被誉为新中国法学教育的“西南联大”。",
  },
  {
    href: "#/home/classification",
    title: "重庆电子工程职业学院",
    description: "中国重庆市境内公办高校",
    content:
      "重庆电子工程职业学院（Chongqing College of Electronic Engineering）始建于1965年，是由重庆市人民政府举办、重庆市教育委员会和重庆市经济和信息化委员会共建的全日制普通高等院校。入选国家示范性高等职业院校、教育部现代学徒制试点高校、国家优质专科高等职业院校、“双高计划”高水平学校建设单位（B档），是中国高等教育学会理事单位、中国高等职业技术教育研究会副会长单位、重庆市高等教育学会副会长单位，是全国毕业生就业典型经验高校。",
  },
  {
    href: "#/home/classification",
    title: "重庆警察学院",
    description: "中国重庆市境内公办高校",
    content:
      "重庆警察学院（Chongqing Police College）是一所由重庆市人民政府主办，受重庆市公安局管理和重庆市教委指导的全日制公安类普通本科院校。",
  },
];

const data = [...forwardData, ...dataMock];

export const SearchContainer = styled.div`
  border-radius: 6px;
`;

// const onSearch = (value: string) => console.log(value);

const KgSearch = () => {
  const [open, setOpen] = useState(false);

  // const options = [
  //   { value: 'Burns Bay Road' },
  //   { value: 'Downing Street' },
  //   { value: 'Wall Street' },
  // ];

  const content = (
    <Space
      direction="vertical"
      size="middle"
      style={{ display: "flex", textAlign: "center" }}
    >
      <Button
        ghost
        style={{ color: "#000" }}
        onClick={() => {
          hide();
        }}
      >
        按距离性
      </Button>
      <Button
        ghost
        style={{ color: "#000" }}
        onClick={() => {
          hide();
        }}
      >
        按相关性
      </Button>
      {/* <Button ghost style={{ color: '#000' }} onClick={() => { hide() }}>按相关性</Button> */}
      {/* <Button ghost style={{ color: '#000' }} onClick={() => { hide() }}>按相关性</Button> */}
    </Space>
  );

  // const tasks = ["高校","办学性质","沙坪坝","本科"];

  const tags = [
    { name: "名称", type: ["高校"] },
    { name: "办学性质", type: ["高等教育", "职业本科"] },
    { name: "所在位置", type: ["沙坪坝"] },
  ];

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  return (
    <div>
      <Card style={{ width: "100%" }} bordered={false}>
        {/* <SearchContainer>
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

        <Divider /> */}
        {/* <AlgorithmSetting/> */}

        <Card
          style={{ marginTop: "20px" }}
          bordered={false}
          title={
            <Typography.Title level={3}>
              查询实体相关概念{<span>(33)</span>}
            </Typography.Title>
          }
          extra={
            <div style={{ clear: "both" }}>
              {" "}
              <Popover
                placement="bottom"
                content={content}
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
              >
                <Button type="primary" shape="round" icon={<SwapOutlined />}>
                  排序方式
                </Button>
              </Popover>
              {" "}
            </div>
          }
        >
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
                    <span style={{}}>
                      <a>点击查看详情</a>{" "}
                    </span>
                  }
                >
                  <List.Item.Meta
                    // avatar={<Avatar src={item.avatar} />}
                    title={
                      <a href={item.href}>
                        <Typography.Title level={4}>
                          {item.title}
                        </Typography.Title>
                      </a>
                    }
                    description={<u>{item.description}</u>}
                  />
                  {item.content}
                  <Divider />
                  {tags.map((tag) => (
                    <Row>
                      <Col span={2}>
                        <Tag color="green">{tag.name}: </Tag>
                      </Col>
                      {tag.type.map((item) => (
                        <Col span={2}>
                          <Tag color="blue">{item}</Tag>
                        </Col>
                      ))}
                    </Row>
                  ))}
                </List.Item>
              </Card>
            )}
          />
        </Card>

        {/* <BackTop/> */}
      </Card>
      {/* <BackTop/> */}
    </div>
  );
};
export default KgSearch;
