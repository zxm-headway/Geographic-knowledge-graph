import { observer } from 'mobx-react'
import G6 from '@antv/g6';
import React, { useEffect, useRef ,useState,useCallback} from 'react'
import styled from "styled-components";
import { AlgorithmSetting } from '../../../../component/homeIndex/AlgorithmSetting';
// import insertCss from 'insert-css';
import domainData from "../../../../mockDate/realdatacertify.json"
import { Card ,Form,Input,Button, Divider,AutoComplete,Popover,Space,Typography} from 'antd';
import D3Main from '../KgPages/D3Main';

let graph: any = null
const GraphContainer = styled.div`
  height: 100vh;
  width: 100%;
`;

// let data = {}

let inputNodeValue:string[] = [];



interface lengend  {
  id: string,
  label:string
}

type filterFunType =  {
  [key:string]:(d: any) => boolean;

}




const SearchShortPath2D: React.FC = observer((props: any) => {
  const graghRef = useRef<any>()

  const buttonRef: any = useRef();


  // const [selectedNodeIds,setSelectedNodeIds] = useState<string[]>([])

  const [nodeValueOne, setNodeValueOne] = useState('');
  const [nodeValueTwo, setNodeValueTwo] = useState('');
  const [optionsNode1, setOptionsNode1] = useState<{ value: string }[]>([]);
  const [optionsNode2, setOptionsNode2] = useState<{ value: string }[]>([]);

  const mockVal = (str: string, repeat = 1) => ({
    value: str.repeat(repeat),
  });


  const onNodePathSearch1 = (searchText: string) => {
    setOptionsNode1(
      !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
    );
  };

  const onNodePathSearch2 = (searchText: string) => {
    setOptionsNode2(
      !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
    );
  };

  const onNodePathSelect1 = (data: string) => {
    console.log('onSelect', data);
  };

  const onNodePathSelect2 = (data: string) => {
    console.log('onSelect', data);
  };

  const onNodePathChange1 = useCallback((data: string) => {
    console.log(typeof data);

    graph.getNodes().forEach((node:any)=>{
      console.log(node)
      if(node._cfg.model.label === data)
      inputNodeValue[0] = node._cfg.model.id
      console.log(inputNodeValue)
    })


    setNodeValueOne(data);
  }, []);

  const onNodePathChange2 = (data: string) => {
    graph.getNodes().forEach((node:any)=>{
      if(node._cfg.model.label === data)
      inputNodeValue[1] = node._cfg.model.id
      console.log(inputNodeValue)
    })
   
    setNodeValueTwo(data);
  };
  


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


  //清除图上所有的样式
  function clearAllStats() {

    
    graph.setAutoPaint(false);
    graph.getNodes().forEach(function (node: any) {
      graph.clearItemStates(node);
      node.show()

    });
    graph.getEdges().forEach(function (edge: any) {
      graph.clearItemStates(edge);
      edge.show()
    });
    graph.paint();
    graph.setAutoPaint(true);
  }


  const clearStates = () => {
    graph.getNodes().forEach((node:any) => {
      graph.clearItemStates(node);
    });
    graph.getEdges().forEach((edge:any) => {
      graph.clearItemStates(edge);
    });
  };


  const clusterMap = new Map();
  let clusterId = 0;


  useEffect(() => {

    
    //发起axios请求获取数据
    let legendType  =  {
      nodes:[
        {id:"type",label:"类型"},
        {id:"belongs",label:"归属"},
        {id:"dataSource",label:"数据来源"},
        {id:"Nature",label:"学校性质"},
        {id:"CompetentAuthorities",label:"主管部门"},
        {id:"Typeschool",label:"办学类型"},
        {id:"NameUniversity",label:"高校名称"}
      ],
      
    }

    const legend = new G6.Legend({
      data: legendType,
      align: 'center',
      layout: 'vertical', // vertical
      position: 'top-left',
      vertiSep: 20,
      horiSep: 20,
      offsetY: 0,
      padding: [4, 16, 8, 16],
      containerStyle: {
        fill: '#fff',
        lineWidth: 0
      },
      title: '属性筛选',
      titleConfig: {
        position: 'left',
        offsetX: 0,
        offsetY: 0,
      },
      filter: {
        enable: true,
        multiple: true,
        trigger: 'click',
        graphActiveState: 'activeByLegend',
        graphInactiveState: 'inactiveByLegend',
        filterFunctions: {
          'type': (d) => {
            console.log(d)
            // d.hide()
              if (d.type=== 'type') {
                // graph.getNodes().forEach(function (node: any) {
                //   // graph.clearItemStates(node);
                //   // console.log(node)

                //   if(d.type === node.type)
                //   {
                //     node.show()
                //   }
                //   // graph.setItemState(node, 'dark', true);
                // });
                return true;
              }
              return false
            },
            'belongs': (d) => {
              if (d.type === 'belongs') return true;
              return false
            },
            'Nature': (d) => {
              if (d.type === 'Nature') return true;
              return false
            },
            'dataSource': (d) => {
              if (d.type === 'dataSource') return true;
              return false
            },
            "CompetentAuthorities": (d) => {
              if (d.type === "CompetentAuthorities") return true;
              return false
            },
            "Typeschool": (d) => {
              if (d.type === "Typeschool") return true;
              return false
            },
            "NameUniversity": (d) => {
              if (d.type === "NameUniversity") return true;
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
      plugins: [legend],
      layout: {
        // Object，可选，布局的方法及其配置项，默认为 random 布局。
        type: 'force2', 
        nodeStrength: 3000 ,
        // edgeStrength:1000,// 指定为力导向布局
        preventOverlap: true,
        linkDistance: 200 // 防止节点重叠
        // nodeSize: 30        // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在上一节的元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
      },
      modes: {
        default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
      },
      defaultNode: {
        size: [50, 50],
        
        style: {
          lineWidth: 2,
          fill: '#DEE9FF',
          stroke: '#5B8FF9',
        },
        labelCfg: {
          style: {
            fill: 'black',
            
          },
          // label: 'node-label',
        },
      },
      defaultEdge: {
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
      nodeStateStyles: {
        activeByLegend: {
          lineWidth: 5,
          strokeOpacity: 0.5,
          stroke: '#f00',
          opacity:1
        },
        inactiveByLegend: {
          opacity: 0.2
        }
      },
      edgeStateStyles: {
        activeByLegend: {
          lineWidth: 10,
          stroke: '#f00',
          strokeOpacity: 0.5,
        },
        inactiveByLegend: {
          opacity: 0.5
        }
      },
    });

    graph.on('node:click', function (e: any) {
      const item: any = e.item;

      //保存节点信息
      console.log(item)
      console.log(item.get('model'))
      ///
      graph.setAutoPaint(false);
      graph.getNodes().forEach(function (node: any) {
        // console.log(node)
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
          // console.log(edge.getModel().id+'_label');
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

    
    graph.on('canvas:click', clearAllStats);

    //对节点进行分类
      domainData.nodes.forEach(function (node:any) {
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

    buttonRef.current.addEventListener("click", (e: any) => {
      // console.log(selectedNodeIds);

      if (inputNodeValue.length !== 2) {
        alert("Please select TWO nodes!\n\r请选择有且两个节点！");
        return;
      }
      clearStates();
      const { findShortestPath } = G6.Algorithm as any;
      // path 为其中一条最短路径，allPath 为所有的最短路径
      const { path, allPath } = findShortestPath(
        domainData,
        inputNodeValue[0],
        inputNodeValue[1]
        // encodeURI(inputNodeValue[0]),
        // encodeURI(inputNodeValue[1])
      );

      console.log(path);

      const pathNodeMap: any = {};
      path.forEach((id: any) => {
        const pathNode = graph.findById(id);
        pathNode.toFront();
        graph.setItemState(pathNode, "highlight", true);
        pathNodeMap[id] = true;
      });
      graph.getEdges().forEach((edge) => {
        const edgeModel = edge.getModel();
        const source = edgeModel.source;
        const target = edgeModel.target;
        const sourceInPathIdx = path.indexOf(source);
        const targetInPathIdx = path.indexOf(target);
        if (sourceInPathIdx === -1 || targetInPathIdx === -1) return;
        if (Math.abs(sourceInPathIdx - targetInPathIdx) === 1) {
          graph.setItemState(edge, "highlight", true);
        } else {
          graph.setItemState(edge, "inactive", true);
        }
      });
      graph.getNodes().forEach((node) => {
        if (!pathNodeMap[node.getID()]) {
          graph.setItemState(node, "inactive", true);
        }
      });
    });

    legendType.nodes.forEach((node:any) => {
      console.log(node)
      const cid = clusterMap.get(node.id);
      console.log(clusterMap,cid)
      if(!node.style){
        node.style = {
       
          fill: colors[cid % colors.length],
          stroke: strokes[cid % strokes.length]
        };
      }

      console.log(node)
      
    })




 

  

   

    
    graph.data(domainData);

    graph.render();




    //根据搜索的内容查找节点\


  }, [])

  return (
    <>
     <Form
          layout={'inline'}
        >
          <Form.Item label="实体1">
            <AutoComplete
              value={nodeValueOne}

              options={optionsNode1}
              style={{ width: 200 }}
              onSelect={onNodePathSelect1}
              onSearch={onNodePathSearch1}
              onChange={onNodePathChange1}
              placeholder="请输入实体名"
            >

            </AutoComplete>
          </Form.Item>
          <Form.Item label="实体2">
            <AutoComplete
              value={nodeValueTwo}

              options={optionsNode2}
              style={{ width: 200 }}
              onSelect={onNodePathSelect2}
              onSearch={onNodePathSearch2}
              onChange={onNodePathChange2}
              placeholder="请输入实体名"
            >

            </AutoComplete>
          </Form.Item>
          <Form.Item >
            <Button type="primary" ref={buttonRef}>查找实体最短路径</Button>
          </Form.Item>
        </Form>
     <Divider/>
      <Card size="small" bordered={false}>
        
       
        <GraphContainer ref={graghRef}></GraphContainer>
      </Card>
      
    </>

  )
})



const SearchShortPath:React.FC = observer((props:any)=>{

  const [isPopver,setIsPopver] = useState<boolean>(false)
  //切换2维度或者3维度
  const [isDemen2,setIsDemen2] = useState<boolean>(true)


  const hide = () => {
    // console.log(e)
    //打开3d图
    // setIsDemen2(false);
    setIsPopver(false)
  };

  const handleOpenChange = (newOpen:any) => {
    setIsPopver(newOpen);
  };

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
          setIsDemen2(true)
        }}
      >
        实体2D展示
      </Button>
      <Button
        ghost
        style={{ color: "#000" }}
        onClick={() => {
          hide();
          setIsDemen2(false)
        }}
      >
        实体3维展示
      </Button>
      {/* <Button ghost style={{ color: '#000' }} onClick={() => { hide() }}>按相关性</Button> */}
      {/* <Button ghost style={{ color: '#000' }} onClick={() => { hide() }}>按相关性</Button> */}
    </Space>
  );


  return(
    <>
      <Card
          style={{ marginTop: "20px" }}
          bordered={false}
          title={
            <Typography.Title level={4}>
              实体可视化展示
            </Typography.Title>
          }
          extra={
            <div style={{ clear: "both" }}>
              {" "}
              <Popover
                placement="bottom"
                content={content}
                trigger="click"
                open={isPopver}
                onOpenChange={handleOpenChange}
              >
                <Button type="primary" shape="round" >
                  2D/3D图切换
                </Button>
              </Popover>
              {" "}
            </div>
          }
          >

      </Card>

      {
        isDemen2?<SearchShortPath2D/>:<D3Main/>
      }  
    </>
  )
  
})

export default SearchShortPath