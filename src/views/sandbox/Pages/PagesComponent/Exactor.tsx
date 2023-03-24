import React, { useEffect, useRef, useState } from "react";
import { Tabs, Button, Form, Input, Row, Col, message, Divider, Card ,Layout} from "antd";
import styled from "styled-components";
import Entity from "./Entity";
import G6 from '@antv/g6';
import { DetailSider } from '../../../../component/homeIndex/DetailSider';
import JsonInOut from "./JsonInOut";
const { Content } = Layout;


const DivContainer = styled.div`
  height: 50vh;
  width: 100%;
`;

const AnalyzeText: React.FC = () => {


  const onFinish = (values: any) => {
    message.info('以成功提交信息！')
  };

  return (
    <>
      <Form name="nest-messages" onFinish={onFinish}>
        <Row justify="center">
          <Col span={16}>
            <Form.Item name={['test', 'name']} label="实体名称" >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={16}>
            <Form.Item name={['user', 'introduction']} label="文本描述">
              <Input.TextArea rows={14} showCount />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col span={4}>
            <Form.Item >
              <Button type="primary" htmlType="submit"  >
                分析
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>





    </>
  )
}


const EntityCrab: React.FC = () => {


  //得到的图数据
  const data = {
    nodes: [
      { id: 'node0', size: 50 ,type:'1',label:'node0' },
      { id: 'node1', size: 50 ,type:'1',label:'node1'},
      { id: 'node2', size: 50 ,type:'1',label:'node2'},
      { id: 'node3', size: 50 ,type:'1',label:'node3'},
      { id: 'node4', size: 50, isLeaf: true ,type:'2',label:'node4'},
      { id: 'node5', size: 50, isLeaf: true ,type:'2',label:'node5'},
      { id: 'node6', size: 50, isLeaf: true ,type:'2',label:'node6'},
      { id: 'node7', size: 50, isLeaf: true ,type:'3',label:'node7'},
      { id: 'node8', size: 50, isLeaf: true ,type:'3',label:'node8'},
      { id: 'node9', size: 50, isLeaf: true ,type:'3',label:'node9'},
      { id: 'node10', size: 50, isLeaf: true,type:'4' ,label:'node10'},
      { id: 'node11', size: 50, isLeaf: true ,type:'4',label:'node11'},
      { id: 'node12', size: 50, isLeaf: true,type:'4' ,label:'node12'},
      { id: 'node13', size: 50, isLeaf: true,type:'4' ,label:'node13'},
      { id: 'node14', size: 50, isLeaf: true ,type:'5',label:'node14'},
      { id: 'node15', size: 50, isLeaf: true,type:'5' ,label:'node15'},
      { id: 'node16', size: 50, isLeaf: true ,type:'5',label:'node16'},
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

  let graph: any = null
  
const graghRef = useRef<any>()

  const [isOpenProps,setIsOpeanProps] = useState<boolean>(false)


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
        {id:"CompetentAuthorities",label:"高校名称"},
        {id:"Typeschool",label:"办学类型"},
        {id:"NameUniversity",label:"高校名称"}
      ],
      
    }



    // let lengend2:lengend[] = []
    //  legendType.nodes.map((item,)=>{
    //  return {id:item.type,label:item.name}
    // })
    // console.log(lengend2)



    const legend = new G6.Legend({
      data: legendType,
      align: 'center',
      layout: 'vertical', // vertical
      position: 'top-left',
      vertiSep: 20,
      horiSep: 20,
      offsetY: -24,
      padding: [4, 16, 8, 16],
      containerStyle: {
        fill: '#fff',
        lineWidth: 0.5
      },
      title: '图例',
      titleConfig: {
        position: 'left',
        offsetX: 0,
        offsetY: 12,
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
      plugins: [],
      layout: {
        // Object，可选，布局的方法及其配置项，默认为 random 布局。
        type: 'force2', 
        // nodeStrength: 3000,
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
      setIsOpeanProps(true)

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

    

    //对节点进行分类
    data.nodes.forEach(function (node:any) {
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

    graph.data(data)


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


    graph.on('canvas:click', clearAllStats);

  

    graph.render();



    //根据搜索的内容查找节点\


  }, [])
  return (
    <>
      <Row>
        <Col span={11}>
          <Card>
            <DivContainer>
            <p>
              西南大学（Southwest University），主体位于重庆市北碚区，是中华人民共和国教育部直属，农业农村部、重庆市共建的全国重点大学。 [1]  位列国家“双一流”、 [110]  “211工程”、“985工程优势学科创新平台”建设高校、“双一流”农科联盟成员高校。 [2]  入选“111计划”、“2011计划”、“百校工程”、卓越农林人才教育培养计划、卓越教师培养计划、国家大学生创新性实验计划、国家级大学生创新创业训练计划、国家建设高水平大学公派研究生项目、国家大学生文化素质教育基地、中国政府奖学金来华留学生接收院校。 [3-4]
              学校溯源于1906年建立的川东师范学堂，1936年更名为四川省立教育学院。1950年四川省立教育学院与国立女子师范学院合并建立西南师范学院，农艺、园艺和农产制造等系与1946年创办的私立相辉学院等合并建立西南农学院。1985年两校分别更名为西南师范大学、西南农业大学。2000年重庆市轻工业职业大学并入西南师范大学；2001年西南农业大学、四川畜牧兽医学院、中国农业科学院柑桔研究所合并组建为新的西南农业大学。2005年西南师范大学、西南农业大学合并组建为西南大学。 [5]
              截至2023年1月，学校占地约8347亩，校舍面积193万平方米；设有44个教学单位，开设102个本科专业；拥有29个一级学科博士学位授权点、54个一级学科硕士学位授权点、2种专业博士学位、27种专业硕士学位、博士后科研流动站（工作站）27个；有专任教师3219人，普通本科生近40000人，硕士、博士研究生15000余人，留学生近2000人。
            </p>
            </DivContainer>
          </Card>
        </Col>
        <Col span={11} >
         
            <div ref={graghRef}>

            </div>
        
        </Col>
      </Row>
    </>
  )
}

const ParticipleClauses:React.FC = ()=>{

  const [isPartciple,setIsPartciple] = useState<boolean>(false)

  useEffect(()=>{
    //发起axios请求，判断是分词还是分句。

  },[])
  return(
    <>
      <Row>
        <Col span={11}>
          <Card>
            <DivContainer>
            <p>
              西南大学（Southwest University），主体位于重庆市北碚区，是中华人民共和国教育部直属，农业农村部、重庆市共建的全国重点大学。 [1]  位列国家“双一流”、 [110]  “211工程”、“985工程优势学科创新平台”建设高校、“双一流”农科联盟成员高校。 [2]  入选“111计划”、“2011计划”、“百校工程”、卓越农林人才教育培养计划、卓越教师培养计划、国家大学生创新性实验计划、国家级大学生创新创业训练计划、国家建设高水平大学公派研究生项目、国家大学生文化素质教育基地、中国政府奖学金来华留学生接收院校。 [3-4]
              学校溯源于1906年建立的川东师范学堂，1936年更名为四川省立教育学院。1950年四川省立教育学院与国立女子师范学院合并建立西南师范学院，农艺、园艺和农产制造等系与1946年创办的私立相辉学院等合并建立西南农学院。1985年两校分别更名为西南师范大学、西南农业大学。2000年重庆市轻工业职业大学并入西南师范大学；2001年西南农业大学、四川畜牧兽医学院、中国农业科学院柑桔研究所合并组建为新的西南农业大学。2005年西南师范大学、西南农业大学合并组建为西南大学。 [5]
              截至2023年1月，学校占地约8347亩，校舍面积193万平方米；设有44个教学单位，开设102个本科专业；拥有29个一级学科博士学位授权点、54个一级学科硕士学位授权点、2种专业博士学位、27种专业硕士学位、博士后科研流动站（工作站）27个；有专任教师3219人，普通本科生近40000人，硕士、博士研究生15000余人，留学生近2000人。
            </p>
            </DivContainer>
          </Card>
        </Col>
        <Col span={11} offset={2}>
          
        </Col>
      </Row>
    </>
  )
}



export default function Exactor() {
  const onChange = (key: string) => {
    console.log(key);
  };

  useEffect(()=>{
    //发起axios的请求，判断属于那个标签
  },[])

  return (
    <>
      <Tabs
        onChange={onChange}
        type="card"
        items={[
          {
            label: `文本输入`,
            key: "1",
            children: <AnalyzeText></AnalyzeText>,
          },
          {
            label: `分词`,
            key: "2",
            children: <ParticipleClauses></ParticipleClauses>,
          },
          {
            label: `分句`,
            key: "3",
            children: <ParticipleClauses></ParticipleClauses>,
          },
          {
            label: `实体抽取`,
            key: "4",
            children: <EntityCrab></EntityCrab>,
          },
          {
            label: `关键词抽取`,
            key: "5",
            children: <EntityCrab></EntityCrab>,
          },
          {
            label: `开放关系抽取`,
            key: "6",
            children: <EntityCrab></EntityCrab>,
          },
          {
            label: `JSON数据导入与导出`,
            key: "7",
            children: <JsonInOut/>,
          },
          
        ]}
      />
    </>
  );
}
