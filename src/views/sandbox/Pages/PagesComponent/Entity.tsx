import { observer } from "mobx-react";
import G6, { Graph, Legend } from "@antv/g6";
import React, { useEffect, useRef, useState } from "react";
import {BorderOutlined, EyeTwoTone,EyeInvisibleTwoTone} from '@ant-design/icons'
import styled from "styled-components";
import { Card, Layout, Space, Badge, Tag, message } from "antd";
import { DetailSider } from "../../../../component/homeIndex/DetailSider";
import { render } from "@testing-library/react";
const { Content } = Layout;

// import insertCss from 'insert-css';
// import domainData from "../../../../mockDate/realdata.json"

const data = {
  nodes: [
    { id: "node0", size: 50, type: "类型", label: "node0" },
    { id: "node1", size: 50, type: "类型", label: "node1" },
    { id: "node2", size: 50, type: "类型", label: "node2" },
    { id: "node3", size: 50, type: "类型", label: "node3" },
    { id: "node4", size: 50, isLeaf: true, type: "归属", label: "node4" },
    { id: "node5", size: 50, isLeaf: true, type: "归属", label: "node5" },
    { id: "node6", size: 50, isLeaf: true, type: "归属", label: "node6" },
    { id: "node7", size: 50, isLeaf: true, type: "数据来源", label: "node7" },
    { id: "node8", size: 50, isLeaf: true, type: "数据来源", label: "node8" },
    { id: "node9", size: 50, isLeaf: true, type: "数据来源", label: "node9" },
    { id: "node10", size: 50, isLeaf: true, type: "高校名称", label: "node10" },
    { id: "node11", size: 50, isLeaf: true, type: "高校名称", label: "node11" },
    { id: "node12", size: 50, isLeaf: true, type: "高校名称", label: "node12" },
    { id: "node13", size: 50, isLeaf: true, type: "高校名称", label: "node13" },
    { id: "node14", size: 50, isLeaf: true, type: "办学类型", label: "node14" },
    { id: "node15", size: 50, isLeaf: true, type: "办学类型", label: "node15" },
    { id: "node16", size: 50, isLeaf: true, type: "办学类型", label: "node16" },
  ],
  edges: [
    { source: "node0", target: "node1" },
    { source: "node0", target: "node2" },
    { source: "node0", target: "node3" },
    { source: "node0", target: "node4" },
    { source: "node0", target: "node5" },
    { source: "node1", target: "node6" },
    { source: "node1", target: "node7" },
    { source: "node2", target: "node8" },
    { source: "node2", target: "node9" },
    { source: "node2", target: "node10" },
    { source: "node2", target: "node11" },
    { source: "node2", target: "node12" },
    { source: "node2", target: "node13" },
    { source: "node3", target: "node14" },
    { source: "node3", target: "node15" },
    { source: "node3", target: "node16" },
  ],
};

let graph: any = null;




const GraphContainer = styled.div`
  height: 50vh;
  width: 100%;
`;

// interface lengend  {
//   id: string,
//   label:string
// }

// type filterFunType =  {
//   [key:string]:(d: any) => boolean;

// }

const Entity: React.FC = observer((props: any) => {
  const graghRef = useRef<any>();

  

  // const [graph,setGraph] = useState<any>(null)

  const [isOpenProps, setIsOpeanProps] = useState<boolean>(false);

  //TAG图标切换
  const [isTagsList,setIsTagsList] = useState<boolean[]>([])

  const colors = [
    "#5B8FF9",
    "#5AD8A6",
    "#5D7092",
    "#F6BD16",
    "#E8684A",
    
    
  ];

  const colorType = ["类型","归属","数据来源","高校名称","办学类型",]
  const strokes = [
    "#5B8FF9",
    "#5AD8A6",
    "#5D7092",
    "#F6BD16",
    "#E8684A",
    "#6DC8EC",
    "#9270CA",
    "#FF9D4D",
    "#269A99",
    "#FF99C3",
  ];

  //清除图上所有的样式
  function clearAllStats() {
    graph.setAutoPaint(false);
    graph.getNodes().forEach(function (node: any) {
      // graph.clearItemStates(node);
      node.show();
    });
    graph.getEdges().forEach(function (edge: any) {
      // graph.clearItemStates(edge);
      edge.show();
    });
    graph.paint();
    graph.setAutoPaint(true);
  }

  //点击tag显示隐藏节点
  const tagChange = (typeValue:string)=>{
    const index = colorType.indexOf(typeValue)
    console.log(index)
    const tagsListBool = [...isTagsList]
    if(index>=0)
    {
      for(let i =0;i<tagsListBool.length;i++){
        tagsListBool[i] = true
      }
      tagsListBool[index] = !tagsListBool[index]
      //切换标签
      setIsTagsList(tagsListBool)
      
      if(!tagsListBool[index]){
        //根据颜色控制节点
      graph.setAutoPaint(false);
      graph.getNodes().forEach(function (node: any) {

            node.hide();
      });

      graph.getNodes().forEach(function (node: any) {
       
        if(node.get("model").type === typeValue)
         {
          node.show();

         }
      });

     
      graph.paint();
      graph.setAutoPaint(true);
      graph.fitView();
      }
      else{
        graph.getNodes().forEach(function (node: any) {

          node.show();
    });

    graph.fitView();
      }


    }
    else{
      message.warning('错误！！！！')
    }
    
  }

  const clusterMap = new Map();
  let clusterId = 0;

  useEffect(() => {
    //发起axios请求获取数据
    let legendType = {
      nodes: [
        { id: "type", label: "类型" },
        { id: "belongs", label: "归属" },
        { id: "dataSource", label: "数据来源" },
        { id: "Nature", label: "学校性质" },
        { id: "CompetentAuthorities", label: "高校名称" },
        { id: "Typeschool", label: "办学类型" },
        // { id: "NameUniversity", label: "高校名称" },
      ],
    };
    
   

    let tagTag = []
    for(let i =0;i<colorType.length;i++){
      
      tagTag.push(true)
      console.log(tagTag)
      setIsTagsList(tagTag)
    }

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
      plugins: [],
      layout: {
        // Object，可选，布局的方法及其配置项，默认为 random 布局。
        type: "force2",
        // nodeStrength: 3000,
        // edgeStrength:1000,// 指定为力导向布局
        preventOverlap: true,
        linkDistance: 200, // 防止节点重叠
        // nodeSize: 30        // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
      },
      modes: {
        default: ["drag-canvas", "drag-node", "zoom-canvas"],
      },
      defaultNode: {
        size: [50, 50],

        style: {
          lineWidth: 2,
          fill: "#DEE9FF",
          stroke: "#5B8FF9",
        },
        labelCfg: {
          style: {
            fill: "black",
          },
          // label: 'node-label',
        },
      },
      defaultEdge: {
        size: 1,
        style: {
          endArrow: {
            path: G6.Arrow.triangle(),
            fill: "#e2e2e2",
          },
          stroke: "#e2e2e2",
          lineAppendWidth: 5,
          labelCfg: {
            position: "center",
            offsetY: -80,
          },
        },

        type: "cubic",
      },
      nodeStateStyles: {
        activeByLegend: {
          lineWidth: 5,
          strokeOpacity: 0.5,
          stroke: "#f00",
          opacity: 1,
        },
        inactiveByLegend: {
          opacity: 0.2,
        },
      },
      edgeStateStyles: {
        activeByLegend: {
          lineWidth: 10,
          stroke: "#f00",
          strokeOpacity: 0.5,
        },
        inactiveByLegend: {
          opacity: 0.5,
        },
      },
    });

    graph.on("node:click", function (e: any) {
      const item: any = e.item;
      
      setIsOpeanProps(true);

      //保存节点信息
      console.log(item);
      console.log(item.get("model"));
      ///
      graph.setAutoPaint(false);
      graph.getNodes().forEach(function (node: any) {
        // graph.clearItemStates(node);
        node.hide();
        // graph.setItemState(node, 'dark', true);
      });
      // graph.setItemState(item, 'dark', false);
      // graph.setItemState(item, 'highlight', true);

      //对节点的邻居节点展示
      graph.getEdges().forEach(function (edge: any) {
        edge.show();
        item.show();

        if (edge.getSource() === item) {
          // graph.setItemState(edge.getTarget(), 'dark', false);
          // graph.setItemState(edge.getTarget(), 'highlight', true);
          // graph.setItemState(edge, 'highlight', true);
          edge.getTarget().show();
          // console.log(edge.getModel().id + "_label");
          //隐藏边
          // graph.hideItem(edge.getModel().id+'_label');
          edge.toFront();
        } else if (edge.getTarget() === item) {
          // graph.setItemState(edge.getSource(), 'dark', false);
          // graph.setItemState(edge.getSource(), 'highlight', true);
          // graph.setItemState(edge, 'highlight', true);
          // console.log(edge.getModel());
          edge.getSource().show();
          // graph.hideItem(edge.getModel().id+'_label');
          edge.toFront();
        } else {
          graph.setItemState(edge, "highlight", false);
          edge.hide();
          // item.isVisible()
        }
      });
      graph.paint();
      graph.setAutoPaint(true);
    });

    // (function () {
    //   const data = domainData
    //   domainData.nodes.forEach((node:any)=>{
    //      if(!node.label){
    //       node.label = node.id
    //      }
    //   })

    //   //对节点进行分类
    //   data.nodes.forEach(function (node:any) {
    //     // cluster
    //     if (node.type && clusterMap.get(node.type) === undefined) {
    //       clusterMap.set(node.type, clusterId);
    //       clusterId++;
    //     }
    //     const cid = clusterMap.get(node.type);
    //     // console.log(cid,clusterMap)
    //     if (!node.style) {
    //       node.style = {};
    //     }
    //     node.style.fill = colors[cid % colors.length];
    //     node.style.stroke = strokes[cid % strokes.length];
    //   });

    //   domainData.links.forEach((link:any)=>{
    //     if(!link.label){
    //       link.label = link.relationship
    //     }
    //   })

    //   graph.data({
    //     nodes: data.nodes,
    //     edges: data.links.map(function (edge: any, i: any) {
    //       edge.id = 'edge' + i;
    //       return Object.assign({}, edge);
    //     }),
    //   });

    // })()

    //对节点进行分类
    data.nodes.forEach(function (node: any) {
      // cluster
      if (node.type && clusterMap.get(node.type) === undefined) {
        clusterMap.set(node.type, clusterId);
        clusterId++;
      }
      const cid = clusterMap.get(node.type);
      // console.log(cid,clusterMap)
      if (!node.style) {
        node.style = {};
      }
      node.style.fill = colors[cid % colors.length];
      node.style.stroke = strokes[cid % strokes.length];
    });

    graph.data(data);

    legendType.nodes.forEach((node: any) => {
      console.log(node);
      const cid = clusterMap.get(node.id);
      console.log(clusterMap, cid);
      if (!node.style) {
        node.style = {
          fill: colors[cid % colors.length],
          stroke: strokes[cid % strokes.length],
        };
      }

      console.log(node);
    });

    graph.on("canvas:click", ()=>{
      clearAllStats()
      let tagTag = []
      for(let i =0;i<colorType.length;i++){
      
      tagTag.push(true)
      console.log(tagTag)
      setIsTagsList(tagTag)
    }

    });

    graph.render();

    return () => {
      graph.destroy();
    };

    //根据搜索的内容查找节点\
  }, []);

  return (
    <>
      <Card size="small" bordered={false}>
        <Layout>
          <Content>
            <Space >
            {colors.map((color,index) => (
                <Tag key={color} color={color} icon={isTagsList[index]?<EyeTwoTone/>:<EyeInvisibleTwoTone/>} onClick = { ()=>{
                  tagChange(colorType[index])
                }}>{colorType[index]} </Tag>
              ))}
            </Space>
          
            <Space direction="vertical">
              
            </Space>
            <GraphContainer ref={graghRef}></GraphContainer>
          </Content>
          <DetailSider isOpenProps={isOpenProps} />
        </Layout>
      </Card>
    </>
  );
});

export default Entity;
