import React, { useEffect, useRef } from "react";
import G6 from "@antv/g6";
import styled from "styled-components";
import type { ColumnsType } from "antd/es/table";
import Entity from '../PagesComponent/Entity'
import JsonInOut from "../PagesComponent/JsonInOut";



import { Card, Space, Table, Tag, Tabs, Row, Col } from "antd";
import WordClouds from "../KgPages/WordClonds";

const GraphContainer = styled.div`
  height: 40vh;
  width: 100%;
`;

const Graphone: React.FC = () => {
  const graghRef = useRef<any>();

 
  
  const colors = [
    '#BDD2FD',
    '#BDEFDB',
    '#C2C8D5',
    '#FBE5A2',
    '#F6C3B7',
    '#B6E3F5',
    '#D3C6EA',
    '#FFD8B8',
    '#AAD8D8',
    '#FFD6E7',
  ];
  const strokes = [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#E8684A',
    '#6DC8EC',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
  ];
  useEffect(() => {
    const container = graghRef.current;
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;
    const graph = new G6.Graph({
      container: graghRef.current,
      width,
      height,
      layout: {
        type: "force2",
        preventOverlap: true,
      },
      defaultNode: {
        size:[50,50],
        color: "#5B8FF9",
      },
      defaultEdge:{
        size: 1,
        style: {
          endArrow: {
            path: G6.Arrow.triangle(),
            fill:'#e2e2e2'
          },
          stroke: '#e2e2e2',
          lineAppendWidth: 5,
          labelCfg: {
            position: 'center',
            offsetY: -80,
          },
          
        },
        
        type: 'cubic'
      },
      modes: {
        default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
      },
    });

    const clusterMap = new Map();
    let clusterId = 0;

    const data = {
      nodes: [
        {
          id: '0',
          label: '0',
          cluster: 'a',
        },
        {
          id: '1',
          label: '1',
          cluster: 'a',
        },
        {
          id: '2',
          label: '2',
          cluster: 'a',
        },
        {
          id: '3',
          label: '3',
          cluster: 'a',
        },
        {
          id: '4',
          label: '4',
          cluster: 'a',
        },
        {
          id: '5',
          label: '5',
          cluster: 'a',
        },
        {
          id: '6',
          label: '6',
          cluster: 'a',
        },
        {
          id: '7',
          label: '7',
          cluster: 'a',
        },
        {
          id: '8',
          label: '8',
          cluster: 'a',
        },
        {
          id: '9',
          label: '9',
          cluster: 'a',
        },
        {
          id: '10',
          label: '10',
          cluster: 'a',
        },
        {
          id: '11',
          label: '11',
          cluster: 'a',
        },
        {
          id: '12',
          label: '12',
          cluster: 'a',
        },
        {
          id: '13',
          label: '13',
          cluster: 'b',
        },
        {
          id: '14',
          label: '14',
          cluster: 'b',
        },
        {
          id: '15',
          label: '15',
          cluster: 'b',
        },
        {
          id: '16',
          label: '16',
          cluster: 'b',
        },
        {
          id: '17',
          label: '17',
          cluster: 'b',
        },
        {
          id: '18',
          label: '18',
          cluster: 'c',
        },
        {
          id: '19',
          label: '19',
          cluster: 'c',
        },
        {
          id: '20',
          label: '20',
          cluster: 'c',
        },
        {
          id: '21',
          label: '21',
          cluster: 'c',
        },
        {
          id: '22',
          label: '22',
          cluster: 'c',
        },
        {
          id: '23',
          label: '23',
          cluster: 'c',
        },
        {
          id: '24',
          label: '24',
          cluster: 'c',
        },
        {
          id: '25',
          label: '25',
          cluster: 'c',
        },
        {
          id: '26',
          label: '26',
          cluster: 'c',
        },
        {
          id: '27',
          label: '27',
          cluster: 'c',
        },
        {
          id: '28',
          label: '28',
          cluster: 'c',
        },
        {
          id: '29',
          label: '29',
          cluster: 'c',
        },
        {
          id: '30',
          label: '30',
          cluster: 'c',
        },
        {
          id: '31',
          label: '31',
          cluster: 'd',
        },
        {
          id: '32',
          label: '32',
          cluster: 'd',
        },
        {
          id: '33',
          label: '33',
          cluster: 'd',
        },
      ],
      edges: [
        {
          source: '0',
          target: '1',
        },
        {
          source: '0',
          target: '2',
        },
        {
          source: '0',
          target: '3',
        },
        {
          source: '0',
          target: '4',
        },
        {
          source: '0',
          target: '5',
        },
        {
          source: '0',
          target: '7',
        },
        {
          source: '0',
          target: '8',
        },
        {
          source: '0',
          target: '9',
        },
        {
          source: '0',
          target: '10',
        },
        {
          source: '0',
          target: '11',
        },
        {
          source: '0',
          target: '13',
        },
        {
          source: '0',
          target: '14',
        },
        {
          source: '0',
          target: '15',
        },
        {
          source: '0',
          target: '16',
        },
        {
          source: '2',
          target: '3',
        },
        {
          source: '4',
          target: '5',
        },
        {
          source: '4',
          target: '6',
        },
        {
          source: '5',
          target: '6',
        },
        {
          source: '7',
          target: '13',
        },
        {
          source: '8',
          target: '14',
        },
        {
          source: '9',
          target: '10',
        },
        {
          source: '10',
          target: '22',
        },
        {
          source: '10',
          target: '14',
        },
        {
          source: '10',
          target: '12',
        },
        {
          source: '10',
          target: '24',
        },
        {
          source: '10',
          target: '21',
        },
        {
          source: '10',
          target: '20',
        },
        {
          source: '11',
          target: '24',
        },
        {
          source: '11',
          target: '22',
        },
        {
          source: '11',
          target: '14',
        },
        {
          source: '12',
          target: '13',
        },
        {
          source: '16',
          target: '17',
        },
        {
          source: '16',
          target: '18',
        },
        {
          source: '16',
          target: '21',
        },
        {
          source: '16',
          target: '22',
        },
        {
          source: '17',
          target: '18',
        },
        {
          source: '17',
          target: '20',
        },
        {
          source: '18',
          target: '19',
        },
        {
          source: '19',
          target: '20',
        },
        {
          source: '19',
          target: '33',
        },
        {
          source: '19',
          target: '22',
        },
        {
          source: '19',
          target: '23',
        },
        {
          source: '20',
          target: '21',
        },
        {
          source: '21',
          target: '22',
        },
        {
          source: '22',
          target: '24',
        },
        {
          source: '22',
          target: '25',
        },
        {
          source: '22',
          target: '26',
        },
        {
          source: '22',
          target: '23',
        },
        {
          source: '22',
          target: '28',
        },
        {
          source: '22',
          target: '30',
        },
        {
          source: '22',
          target: '31',
        },
        {
          source: '22',
          target: '32',
        },
        {
          source: '22',
          target: '33',
        },
        {
          source: '23',
          target: '28',
        },
        {
          source: '23',
          target: '27',
        },
        {
          source: '23',
          target: '29',
        },
        {
          source: '23',
          target: '30',
        },
        {
          source: '23',
          target: '31',
        },
        {
          source: '23',
          target: '33',
        },
        {
          source: '32',
          target: '33',
        },
      ],
    };
    // const nodes = data.nodes;
    // graph.data({
    //   nodes,
    //   edges: data.edges.map(function (edge: any, i) {
    //     edge.id = "edge" + i;
    //     return Object.assign({}, edge);
    //   }),
    // });

    //对节点进行分类
    data.nodes.forEach(function (node:any) {
      // cluster
      if (node.cluster && clusterMap.get(node.cluster) === undefined) {
        clusterMap.set(node.cluster, clusterId);
        clusterId++;
      }
      const cid = clusterMap.get(node.cluster);
      // console.log(cid,clusterMap)
      if (!node.style) {
        node.style = {};
      }
      node.style.fill = colors[cid % colors.length];
      node.style.stroke = strokes[cid % strokes.length];
    });

    graph.data(data)
    graph.render();

      //清除图上所有的样式
  function clearAllStats() {

  
    
    graph.setAutoPaint(false);
    graph.getNodes().forEach(function (node: any) {
      // graph.clearItemStates(node);
      node.show()

    });
    graph.getEdges().forEach(function (edge: any) {
      // graph.clearItemStates(edge);
      edge.show()
    });
    graph.paint();
    graph.setAutoPaint(true);
  }

    graph.on('canvas:click', clearAllStats);

    graph.on('node:click', function (e: any) {
      const item: any = e.item;

      //保存节点信息
      console.log(item)
      console.log(item.get('model'))
      ///
      graph.setAutoPaint(false);
      graph.getNodes().forEach(function (node: any) {
        // graph.clearItemStates(node);
        node.hide()
        // graph.setItemState(node, 'dark', true);
      });
      // graph.setItemState(item, 'dark', false);
      // graph.setItemState(item, 'highlight', true);

      //对节点的邻居节点展示
      graph.getEdges().forEach(function (edge: any) {

        edge.show()
        item.show()
       
        if (edge.getSource() === item ) {
          // graph.setItemState(edge.getTarget(), 'dark', false);
          // graph.setItemState(edge.getTarget(), 'highlight', true);
          // graph.setItemState(edge, 'highlight', true);
          edge.getTarget().show()
          console.log(edge.getModel().id+'_label');
          //隐藏边
          // graph.hideItem(edge.getModel().id+'_label');
          edge.toFront();
        } 
        else if (edge.getTarget() === item) {
          // graph.setItemState(edge.getSource(), 'dark', false);
          // graph.setItemState(edge.getSource(), 'highlight', true);
          // graph.setItemState(edge, 'highlight', true);
          // console.log(edge.getModel());
          edge.getSource().show()
          // graph.hideItem(edge.getModel().id+'_label');
          edge.toFront();
        } 
        else {
          graph.setItemState(edge, 'highlight', false);
          edge.hide()
          // item.isVisible()
        }
      });
      graph.paint();
      graph.setAutoPaint(true);
    });


    graph.on("node:dragstart", function (e) {
      graph.layout();
      refreshDragedNodePosition(e);
    });
    graph.on("node:drag", function (e) {
      refreshDragedNodePosition(e);
    });
    graph.on("node:dragend", function (e: any) {
      e.item.get("model").fx = null;
      e.item.get("model").fy = null;
    });

    function refreshDragedNodePosition(e: any) {
      const model = e.item.get("model");
      model.fx = e.x;
      model.fy = e.y;
    }
  }, []);

  return (
    <>
      <Card size="small" bordered={false}>
        <GraphContainer ref={graghRef}></GraphContainer>
      </Card>
    </>
  );
};



const onChange = (key: string) => {
  console.log(key);
};

const Classification: React.FC = () => {
  interface DataType {
    key: string;
    name: string;

    address: string;
    tags: string[];
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (title: any) => <a>{title}</a>,
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (tags: string[]) => (
        <span>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>在知识图上查看节点</a>
        </Space>
      ),
    },
  ];

  const Tabledata: DataType[] = [];

  for (let i = 0; i < 100; i++) {
    Tabledata.push({
      key: i.toString(),
      name: `Edrward ${i}`,

      address: `London Park no. ${i}`,
      tags: ["nice", "developer"],
    });
  }

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <Row>
        <Col span={24}>
        
        <Card size="small" title={"九交模型"}>
        <Tabs
          type="card"
          defaultActiveKey="1"
          onChange={onChange}
          items={[
            {
              label: `时间关系`,
              key: "1",
              children: <Entity></Entity>,
            },
            {
              label: `空间关系`,
              key: "2",
              children: <Graphone></Graphone>,
            },
            {
              label: `拓扑关系`,
              key: "3",
              children: <Entity></Entity>,
            },
            {
              label: `属性关系`,
              key: "4",
              children: <Entity></Entity>,
            },
            {
              label: `成员关系`,
              key: "5",
              children: <Entity></Entity>,
            },
            {
              label: `变化关系`,
              key: "6",
              children: <Entity></Entity>,
            },
            {
              label: `同义关系`,
              key: "7",
              children: <Entity></Entity>,
            },
            {
              label: `方向关系`,
              key: "8",
              children: <Entity></Entity>,
            },
            {
              label: `度量关系`,
              key: "9",
              children: <Entity></Entity>,
            },

          ]}
        />
      </Card>
        </Col>
        
      </Row>
      <Row>
        <Col span={14}>
          <Card size="small" title="Information">
            <p>
              <mark>西南大学（Southwest
              University)</mark>,主体位于重庆市北碚区，是中华人民共和国<mark>教育部直属</mark>,农业农村部、重庆市共建的全国重点大学。位列国家“双一流”、“211工程”、“985工程优势学科创新平台”建设高校、“双一流”农科联盟成员高校。入选“111计划”、“2011计划”、“百校工程”、卓越农林人才教育培养计划、卓越教师培养计划、国家大学生创新性实验计划、国家级大学生创新创业训练计划、国家建设高水平大学公派研究生项目、国家大学生文化素质教育基地、中国政府奖学金来华留学生接收院校。
              学校溯源于1906年建立的<mark>川东师范学堂</mark>,1936年更名为四川省立教育学院。1950年四川省立教育学院与国立女子师范学院合并建立西南师范学院，农艺、园艺和农产制造等系与1946年创办的私立相辉学院等合并建立西南农学院。1985年两校分别更名为西南师范大学、西南农业大学。2000年重庆市轻工业职业大学并入西南师范大学；2001年西南农业大学、四川畜牧兽医学院、中国农业科学院柑桔研究所合并组建为新的西南农业大学。2005年西南师范大学、西南农业大学合并组建为西南大学。
              截至2022年3月，学校占地约8295亩，校舍面积187万平方米；设有43个教学单位，开设102个本科专业；拥有29个一级学科博士学位授权点、54个一级学科硕士学位授权点、2种专业博士学位、27种专业硕士学位、博士后科研流动站（工作站）27个；有专任教师3162人，普通本科生近40000人，硕士、博士研究生14000余人，留学生近2000人。
            </p>
          </Card>
        </Col>
        <Col span={10}>
          <Card size="small" title={'关键词云'}>
            <WordClouds />
          </Card>
        </Col>
        
      </Row>


      <Card size="small" title="节点基本信息描述">
        <Table
          columns={columns}
          pagination={{
            position: ["bottomCenter"],
            defaultCurrent: 1,
            defaultPageSize: 5,
          }}
          dataSource={Tabledata}
        />
      </Card>
    </Space>
  );
};

export default Classification;


