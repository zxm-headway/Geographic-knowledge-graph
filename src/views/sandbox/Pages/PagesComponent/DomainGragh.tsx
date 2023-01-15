import { observer } from 'mobx-react'
import G6, { Legend } from '@antv/g6';
import React, { useEffect, useRef, useState } from 'react'
import insertCss from 'insert-css';
import domainData from "../../../../mockDate/domainData.json"
import { Col, Divider, Drawer, Row } from 'antd';


let graph: any = null

//抽屉框内容格式参数配置
interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

//对抽屉框中的内容进行格式排版
const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
  <div className="site-description-item-profile-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
    <div className="site-description-item-profile-p-label">{title}:</div>
    <div>{content}</div>
  </div>
);


//lengend的配置数据
const typeConfigs: any = {
  'type1': {
    type: 'circle',
    size: 20,
    style: {
      fill: '#5B8FF9',
      stroke: '#5B8FF9',
    }
  },
  'type2': {
    type: 'circle',
    size: 20,
    style: {
      fill: '#5AD8A6',
      stroke: '#5AD8A6'
    }
  },
  'type3': {
    type: 'circle',
    size: 20,
    style: {
      fill: '#5D7092',
      stroke: '#5D7092'
    }
  },
  'type4': {
    type: 'circle',
    size: 20,
    style: {
      fill: '#F6BD16',
      stroke: '#F6BD16',
    }
  },
  'type5': {
    type: 'circle',
    size: 20,
    style: {
      fill: '#6F5EF9',
      stroke: '#6F5EF9'
    }
  }
}

//对data数据中的每个节点随机附一个类型
domainData.nodes.map((node: any) => {
  const randomNumber = Math.floor(Math.random() * 5) + 1;
  const selectType = 'type' + randomNumber
  //给节点添加类型信息
  node['legend'] = selectType
  node['style'] = typeConfigs[selectType].style
  // node = Object.assign(node, { ...typeConfigs[node.legend] });
});

//legend的数据配置
const legendData = {
  nodes:
    [{
      id: 'type1',
      label: '政府',
      order: 0,
      ...typeConfigs['type1']
    },
    {
      id: 'type2',
      label: '商业',
      order: 1,
      ...typeConfigs['type2']
    },
    {
      id: 'type3',
      label: '河流',
      order: 2,
      ...typeConfigs['type3']
    },
    {
      id: 'type4',
      label: 'type4',
      order: 3,
      ...typeConfigs['type4']
    },
    {
      id: 'Type5',
      label: 'type5',
      ...typeConfigs['type5']
    },]
}




const DomainGragh: React.FC = observer((props: any) => {
  const graghRef = useRef<any>()

  //存储上一次的结果跟最新的搜索结果
  //旧的搜索值
  const [preSearchValue, setPreSearchValue] = useState<string>('')
  //新的搜索值
  const [newSearchValue, setNewSearchValue] = useState<string>('')
  //保存所点击节点的信息，以便放在Drawer中
  const [keepNodeInfo, setKeepNodeInfo] = useState<any>({})

  //对搜索节点的新旧值进行转换函数
  const FromNewToOld = () => {

    if (newSearchValue.toUpperCase() === props.searchNodeName.toUpperCase()) {
      return
    }
    else {
      setPreSearchValue(newSearchValue)
      setNewSearchValue(props.searchNodeName)
    }

    console.log(preSearchValue, newSearchValue)

  }

  //清除图上所有的样式
  function clearAllStats() {
    graph.setAutoPaint(false);
    graph.getNodes().forEach(function (node: any) {
      graph.clearItemStates(node);
    });
    graph.getEdges().forEach(function (edge: any) {
      graph.clearItemStates(edge);
    });
    graph.paint();
    graph.setAutoPaint(true);
  }

  //对图上找到的点进行样式设置
  function setGraphStyle(graph: any, item: any) {

    // graph.setAutoPaint(false);
    // graph.getNodes().forEach(function (node: any) {
    //   graph.clearItemStates(node);
    //   graph.setItemState(node, 'dark', true);
    // });
    // graph.setItemState(findNode, 'dark', false);
    // graph.setItemState(findNode, 'highlight', true);
    // graph.getEdges().forEach(function (edge: any) {
    //   if (edge.getSource() === findNode) {
    //     graph.setItemState(edge.getTarget(), 'dark', false);
    //     graph.setItemState(edge.getTarget(), 'highlight', true);
    //     graph.setItemState(edge, 'highlight', true);
    //     edge.toFront();
    //   } else if (edge.getTarget() === findNode) {
    //     graph.setItemState(edge.getSource(), 'dark', false);
    //     graph.setItemState(edge.getSource(), 'highlight', true);
    //     graph.setItemState(edge, 'highlight', true);
    //     edge.toFront();
    //   } else {
    //     graph.setItemState(edge, 'highlight', false);
    //   }
    // });
    // graph.paint();
    // graph.setAutoPaint(true);
    graph.setAutoPaint(false);
    graph.getNodes().forEach(function (node: any) {
      graph.clearItemStates(node);
      graph.setItemState(node, 'dark', true);
    });
    graph.setItemState(item, 'dark', false);
    graph.setItemState(item, 'highlight', true);
    graph.getEdges().forEach(function (edge: any) {
      if (edge.getSource() === item) {
        graph.setItemState(edge.getTarget(), 'dark', false);
        graph.setItemState(edge.getTarget(), 'highlight', true);
        graph.setItemState(edge, 'highlight', true);
        edge.toFront();
      } else if (edge.getTarget() === item) {
        graph.setItemState(edge.getSource(), 'dark', false);
        graph.setItemState(edge.getSource(), 'highlight', true);
        graph.setItemState(edge, 'highlight', true);
        edge.toFront();
      } else {
        graph.setItemState(edge, 'highlight', false);
      }
    });
    graph.paint();
    graph.setAutoPaint(true);

  }

  //通过搜索框内容查找节点,并且突出查找的样式
  const FindNodeByName = (value: string, graph: any) => {
    console.log(value)

    let findNode: any = null

    setTimeout(() => {
      findNode = graph.find('node', (node: any) => {
        return node.get('model').name == value;

      });
      console.log(findNode)
      return findNode
    }, 200);





    // 对找到的节点进行处理
    // setGraphStyle(graph, findNode)

  }

  //对G6图进行初始化
  const initGraph = () => {

  }



  useEffect(() => {

    const tooltip = new G6.Tooltip({
      offsetX: 10,
      offsetY: 10,
      fixToNode: [1, 0.5],
      // the types of items that allow the tooltip show up
      // 允许出现 tooltip 的 item 类型
      itemTypes: ['node', 'edge'],
      // custom the tooltip's content
      // 自定义 tooltip 内容
      getContent: (e: any) => {
        const outDiv = document.createElement('div');
        outDiv.style.width = 'fit-content';
        outDiv.style.height = 'fit-content';
        const model = e.item.getModel();
        if (e.item.getType() === 'node') {
          outDiv.innerHTML = `${model.name}`;
        } else {
          const source = e.item.getSource();
          const target = e.item.getTarget();
          outDiv.innerHTML = `来源：${source.getModel().name}<br/>去向：${target.getModel().name}`;
        }
        return outDiv;
      },
    });

    //对legend插件进行配置
    const legend = new G6.Legend({
      data: legendData,
      align: 'center',
      layout: 'vertical', // vertical
      position: 'bottom-left',
      vertiSep: 40,
      horiSep: 100,
      offsetY: -3,
      padding: [4, 16, 8, 16],
      containerStyle: {
        fill: '#ccc',
        lineWidth: 1
      },
      title: '领域信息',
      titleConfig: {
        position: 'center',
        offsetX: 0,
        offsetY: 12,
      },
      filter: {
        enable: true,
        multiple: true,
        trigger: 'click',
        graphActiveState: 'highlight',
        graphInactiveState: 'dark',
        filterFunctions: {
          'type1': (d) => {
            if (d.legendType === 'type1') return true;
            return false
          },
          'type2': (d) => {
            if (d.legendType === 'type2') return true;
            return false
          },
          'type3': (d) => {
            if (d.legendType === 'type3') return true;
            return false
          },
          'type4': (d) => {
            if (d.legendType === 'type4') return true;
            return false
          },
          'type5': (d) => {
            if (d.legendType === 'type5') return true;
            return false
          },

        }
      }
    });

    const container = graghRef.current;
    const width = container.scrollWidth;
    const height = container.scrollHeight || 500;

    if (graph) {
      graph.destroy();

    }
    graph = new G6.Graph({
      container: graghRef.current,
      width,
      height,
      plugins: [tooltip, legend],
      layout: {
        // Object，可选，布局的方法及其配置项，默认为 random 布局。
        type: 'force', // 指定为力导向布局
        preventOverlap: true,
        linkDistance: 200 // 防止节点重叠
        // nodeSize: 30        // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
      },
      modes: {
        default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
      },
      defaultNode: {
        size: [20, 20],
        style: {
          lineWidth: 2,
          fill: '#DEE9FF',
          stroke: '#5B8FF9',
        },
      },
      defaultEdge: {
        size: 1,
        style: {
          endArrow: {
            path: G6.Arrow.triangle(10, 20, 25), // 使用内置箭头路径函数，参数为箭头的 宽度、长度、偏移量（默认为 0，与 d 对应）

          },
          stroke: '#e2e2e2',
          lineAppendWidth: 5,
        },
      },
      nodeStateStyles: {
        highlight: {
          opacity: 1,
        },
        dark: {
          opacity: 0.1,
          stroke: 'green'
        },
      },
      edgeStateStyles: {
        highlight: {
          stroke: '#999',
        },
        dark: {
          stroke: '#fff',
          opacity: 0.1,
        },

      },
    });

    graph.on('node:click', function (e: any) {
      const item: any = e.item;

      //保存节点信息
      console.log(item)
      console.log(item.get('model'))

      setKeepNodeInfo(e.item.get('model'))

      setTimeout(() => {
        console.log(keepNodeInfo)
      }, 1000);

      graph.setAutoPaint(false);
      graph.getNodes().forEach(function (node: any) {
        graph.clearItemStates(node);
        graph.setItemState(node, 'dark', true);
      });
      graph.setItemState(item, 'dark', false);
      graph.setItemState(item, 'highlight', true);
      graph.getEdges().forEach(function (edge: any) {
        if (edge.getSource() === item) {
          graph.setItemState(edge.getTarget(), 'dark', false);
          graph.setItemState(edge.getTarget(), 'highlight', true);
          graph.setItemState(edge, 'highlight', true);
          edge.toFront();
        } else if (edge.getTarget() === item) {
          graph.setItemState(edge.getSource(), 'dark', false);
          graph.setItemState(edge.getSource(), 'highlight', true);
          graph.setItemState(edge, 'highlight', true);
          edge.toFront();
        } else {
          graph.setItemState(edge, 'highlight', false);
        }
      });
      graph.paint();
      graph.setAutoPaint(true);
    });


    graph.on('canvas:click', clearAllStats);

    if (props.searchNodeName) {
      FromNewToOld()
      // graph.on('keydown', function (e: any) {
      //   const item = FindNodeByName(props.searchNodeName, graph)
      //   setGraphStyle(graph, item)
      // })

    }

    (function () {
      const data: any = domainData as any

      graph.data({
        nodes: data.nodes,
        edges: data.edges.map(function (edge: any, i: any) {
          edge.id = 'edge' + i;
          return Object.assign({}, edge);
        }),
      });


    })()

    graph.render();



    //根据搜索的内容查找节点\


  }, [props.searchNodeName, props.regionNode,])

  return (
    <>
      <div ref={graghRef} style={{ height: '75vh', width: '100%' }}>
      </div>
      <Drawer width={640} placement="right" closable={false} onClose={props.closeDrawer} open={props.isDrawer}>
        <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
          Node Information
        </p>

        <p className="site-description-item-profile-p">{keepNodeInfo.label}</p>

        <Row>
          <Col span={12}>
            <DescriptionItem title="Full Name" content="Lily" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Account" content="AntDesign@example.com" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="City" content="HangZhou" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Country" content="China🇨🇳" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Birthday" content="February 2,1900" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Website" content="-" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Message"
              content="Make things as simple as possible but no simpler."
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Company</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Position" content="Programmer" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Responsibilities" content="Coding" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Department" content="XTech" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Supervisor" content={<a>Lin</a>} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Skills"
              content="C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Contacts</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Email" content="AntDesign@example.com" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Phone Number" content="+86 181 0000 0000" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Github"
              content={
                <a href="http://github.com/ant-design/ant-design/">
                  github.com/ant-design/ant-design/
                </a>
              }
            />
          </Col>
        </Row>



      </Drawer>
      <div>{props.searchNodeName}+{props.regionNode}</div>
    </>

  )
})


export default DomainGragh