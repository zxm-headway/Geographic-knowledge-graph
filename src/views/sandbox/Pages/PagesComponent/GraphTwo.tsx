import React, { useEffect, useRef } from 'react'
import G6 from '@antv/g6';
import styled from 'styled-components';
// import type { ColumnsType } from 'antd/es/table';

import { Card, Space ,Tabs} from 'antd';

const onChange = (key: string) => {
  console.log(key);
};

const GraphContainer = styled.div`
  height: 250px;
  width: 100%;
`;

const Graph:React.FC = ()=>{
  const graghRef = useRef<any>()
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

  return (
    <>
     
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
      <Card size="small" bordered={false} >

        <GraphContainer ref={graghRef}>

        </GraphContainer>

      </Card>
  
  </>
  )

}

const GraphTwo: React.FC = () => (
  <Tabs
    defaultActiveKey="1"
    onChange={onChange}
    items={[
      {
        label: `Tab 1`,
        key: '1',
        children: <Graph></Graph>,
      },
      {
        label: `Tab 2`,
        key: '2',
        children: `Content of Tab Pane 2`,
      },
      {
        label: `Tab 3`,
        key: '3',
        children: `Content of Tab Pane 3`,
      },
    ]}
  />
);

export default GraphTwo;