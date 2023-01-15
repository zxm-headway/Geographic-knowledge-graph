import React, { useEffect, useRef } from 'react'
import G6 from '@antv/g6';
import styled from 'styled-components';
import type { ColumnsType } from 'antd/es/table';

import { Card, Space, Collapse, Table, Tag } from 'antd';

const { Panel } = Collapse;


const GraphContainer = styled.div`
  height: 250px;
  width: 100%;
`;


const Classification: React.FC = () => {

  const graghRef = useRef<any>()

  interface DataType {
    key: string;
    name: string;

    address: string;
    tags: string[];
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (title: any) => <a>{title}</a>,
    },

    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <span>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
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
      title: 'Action',
      key: 'action',
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
      tags: ['nice', 'developer'],
    });
  }

  useEffect(() => {
    const container = graghRef.current;
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;
    const graph = new G6.Graph({
      container: graghRef.current,
      width,
      height,
      layout: {
        type: 'force',
        preventOverlap: true,
        linkDistance: (d: any) => {
          if (d.source.id === 'node0') {
            return 100;
          }
          return 30;
        },
        nodeStrength: (d: any) => {
          if (d.isLeaf) {
            return -50;
          }
          return -10;
        },
        edgeStrength: (d: any) => {
          if (d.source.id === 'node1' || d.source.id === 'node2' || d.source.id === 'node3') {
            return 0.7;
          }
          return 0.1;
        },
      },
      defaultNode: {
        color: '#5B8FF9',
      },
      modes: {
        default: ['drag-canvas'],
      },
    });

    const data = {
      nodes: [
        { id: 'node0', size: 50 },
        { id: 'node1', size: 30 },
        { id: 'node2', size: 30 },
        { id: 'node3', size: 30 },
        { id: 'node4', size: 30, isLeaf: true },
        { id: 'node5', size: 30, isLeaf: true },
        { id: 'node6', size: 15, isLeaf: true },
        { id: 'node7', size: 15, isLeaf: true },
        { id: 'node8', size: 15, isLeaf: true },
        { id: 'node9', size: 15, isLeaf: true },
        { id: 'node10', size: 15, isLeaf: true },
        { id: 'node11', size: 15, isLeaf: true },
        { id: 'node12', size: 15, isLeaf: true },
        { id: 'node13', size: 15, isLeaf: true },
        { id: 'node14', size: 15, isLeaf: true },
        { id: 'node15', size: 15, isLeaf: true },
        { id: 'node16', size: 15, isLeaf: true },
      ],
      edges: [
        { source: 'node0', target: 'node1' },
        { source: 'node0', target: 'node2' },
        { source: 'node0', target: 'node3' },
        { source: 'node0', target: 'node4' },
        { source: 'node0', target: 'node5' },
        { source: 'node1', target: 'node6' },
        { source: 'node1', target: 'node7' },
        { source: 'node2', target: 'node8' },
        { source: 'node2', target: 'node9' },
        { source: 'node2', target: 'node10' },
        { source: 'node2', target: 'node11' },
        { source: 'node2', target: 'node12' },
        { source: 'node2', target: 'node13' },
        { source: 'node3', target: 'node14' },
        { source: 'node3', target: 'node15' },
        { source: 'node3', target: 'node16' },
      ],
    };
    const nodes = data.nodes;
    graph.data({
      nodes,
      edges: data.edges.map(function (edge: any, i) {
        edge.id = 'edge' + i;
        return Object.assign({}, edge);
      }),
    });
    graph.render();

    graph.on('node:dragstart', function (e) {
      graph.layout();
      refreshDragedNodePosition(e);
    });
    graph.on('node:drag', function (e) {
      refreshDragedNodePosition(e);
    });
    graph.on('node:dragend', function (e: any) {
      e.item.get('model').fx = null;
      e.item.get('model').fy = null;
    });

    function refreshDragedNodePosition(e: any) {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
    }
  }, [])

  const onChange = (key: string | string[]) => {
    console.log(key);
  };


  const filterTitleChange = () => {

  };

  const fetchData = () => { };



  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      {/* <Card size="small" >
        <Collapse defaultActiveKey={['1']} onChange={onChange}>
          <Panel header="甄选" key="1">
            <Form layout="inline">
              <Form.Item label="地点:">
                <Input onChange={() => { filterTitleChange() }} />
              </Form.Item>
              <Form.Item label="类型:">
                <Select
                  style={{ width: 120 }}
                  onChange={() => { filterTitleChange() }}>
                  <Select.Option value="published">政府</Select.Option>
                  <Select.Option value="draft">商业区</Select.Option>
                  <Select.Option value="draft">河流</Select.Option>
                  <Select.Option value="draft">学校</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" icon="search" onClick={() => { fetchData() }} >
                  搜索
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </Card> */}
      <Card size="small" extra={<a href="#">查看更多关联</a>} title="Visualization">

        <GraphContainer ref={graghRef}>

        </GraphContainer>

      </Card>
      <Card size="small" title="Information" >

        <p>
          西南大学（Southwest University），主体位于重庆市北碚区，是中华人民共和国教育部直属，农业农村部、重庆市共建的全国重点大学。位列国家“双一流”、“211工程”、“985工程优势学科创新平台”建设高校、“双一流”农科联盟成员高校。入选“111计划”、“2011计划”、“百校工程”、卓越农林人才教育培养计划、卓越教师培养计划、国家大学生创新性实验计划、国家级大学生创新创业训练计划、国家建设高水平大学公派研究生项目、国家大学生文化素质教育基地、中国政府奖学金来华留学生接收院校。
          学校溯源于1906年建立的川东师范学堂，1936年更名为四川省立教育学院。1950年四川省立教育学院与国立女子师范学院合并建立西南师范学院，农艺、园艺和农产制造等系与1946年创办的私立相辉学院等合并建立西南农学院。1985年两校分别更名为西南师范大学、西南农业大学。2000年重庆市轻工业职业大学并入西南师范大学；2001年西南农业大学、四川畜牧兽医学院、中国农业科学院柑桔研究所合并组建为新的西南农业大学。2005年西南师范大学、西南农业大学合并组建为西南大学。
          截至2022年3月，学校占地约8295亩，校舍面积187万平方米；设有43个教学单位，开设102个本科专业；拥有29个一级学科博士学位授权点、54个一级学科硕士学位授权点、2种专业博士学位、27种专业硕士学位、博士后科研流动站（工作站）27个；有专任教师3162人，普通本科生近40000人，硕士、博士研究生14000余人，留学生近2000人。
        </p>

      </Card>
      <Card size="small" title="InfoBox">

        <Table columns={columns} pagination={{ position: ['bottomCenter'], defaultCurrent: 1, defaultPageSize: 5 }} dataSource={Tabledata} />

      </Card>

    </Space>
  );
};

export default Classification;