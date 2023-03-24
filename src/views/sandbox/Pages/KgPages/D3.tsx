import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import { ForceGraph3D } from "react-force-graph";
import data from "../../../../mockDate/realdata.json";

import { CSS2DObject, CSS2DRenderer } from "../../../plugin/CSS2DObject";
import SpriteText from "three-spritetext";
import nodeLabelStyle from "../css/nodelabel.module.css";
import { Col, Divider, Drawer, message, Row, List, Switch, Input } from "antd";
import { debounce } from "lodash";
// import { setTimeout } from "timers";
// import * as d3Force from 'd3-force';

// import * as THREE from "three";
// import { group } from "console";

// import { link } from "fs";

let targetNodeValue: any[] = [];
let sourceNodeValue: any[] = [];
let particleTimer: any = {};

const NODE_R = 7;
const distance = 1400;

// interface nodesType {
//   id: string;
//   group: number;
//   // value:string;
//   neighbors?: {
//     id: string;
//     group: number;
//     neighbors: any[];
//     links: any[];
//   }[];
//   links?: linksType[];
//   // [key: string]: any;
// }
// interface linksType {
//   source: string;
//   target: string;
//   value: number;
// }

// interface dataGraghType {
//   nodes: nodesType[];
//   links: linksType[];
// }

//抽屉框内容格式参数配置
interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

export default function D3(props: any) {
  //use-react部分
  const fgRef = useRef<any>();
  const extraRenderers = [new CSS2DRenderer()];
  //保存所点击节点的信息，以便放在Drawer中
  const [keepNodeInfo, setKeepNodeInfo] = useState<any>({});
  //得到有父级d3main传来得图数据
  // const {GraphData} = props

  //设置图形依赖的数据
  const [tryGraphData, setTryGraphData] = useState(data);

  //在触碰后节点对数据进行操作并保存节点数据
  const [operationData, setOperationData] = useState({});

  //保存点击节点的所有目标节点
  const [targetNode, setTargetNode] = useState<any>([]);

  //保存节点与边高亮值

  // const [highlightNodes, setHighlightNodes] = useState(new Set());
  // const [highlightLinks, setHighlightLinks] = useState(new Set());

  const [hoverHighLightNode, setHoverHighLightNode] = useState(null);

  //保存所有节点是source的源节点
  const [sourceNode, setSourceNode] = useState<any>([]);

  //记录鼠标点击边的次数，用于粒子发射
  const [linkClickCount, setLinkClickCount] = useState<number>(0);

  //记录点击的边
  const [linkSame, setLinkSame] = useState<any>(null);

  //保存当鼠标触碰到节点时，得到节点边与邻居节点的信息数据
  const [newHoverAfterData, setNewHoverAfterData] = useState<any>({});

  //保存控制图列
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  //初始化图例分类的数量
  const [categories, setCategories] = useState<string[]>([]);

  //记录获取到图例分类的数量
  const [categoriesLength, setCategoriesLength] = useState<number>(0)

  //父级传来的信息
  // const [searchNodeValueFarter, setSearchNodeValueFarter] = useState<any>(
  //   props.searchNodeValue
  // );

  // const {regionValue,searchNodeValue} = props
  //将axios请求来的数据保存
  // const [graphData,setGraphData] = useState<any>({})

  //获取模拟数据,并进行相关的操作时，进行页面的刷新。

  useEffect(() => {
    // console.log(props);
    // dataInitial();
    console.log(props.searchNodeName);
    props.searchNodeName
      ? previewsFistNode(props.searchNodeName)
      : previewsFistNode();
    // previewsFistNode()

    //发起请求获取图例控制数量
    const lengend = [
      "类型",
      "学校性质",
      "主管部门",
      "办学类型",
      "高校名称",
      "数据来源",
      "归属",
    ];
    setCategories(lengend);
    setCategoriesLength(lengend.length)
    // console.log("页面更新了一次", props.searchNodeValue);
    console.log(tryGraphData);
  }, [props.searchNodeName, tryGraphData]);

  //旋转
  // useEffect(() => {
  //   fgRef.current.cameraPosition({ z: distance });

  //   // camera orbit
  //   let angle = 0;
  //   setInterval(() => {
  //     fgRef.current.cameraPosition({
  //       x: distance * Math.sin(angle),
  //       z: distance * Math.cos(angle)
  //     });
  //     angle += Math.PI / 300;
  //   }, 10);
  // }, []);

  //对抽屉框中的内容进行格式排版
  const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
    <div
      className="site-description-item-profile-wrapper"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <div className="site-description-item-profile-p-label">{title}:</div>
      <div>{content}</div>
    </div>
  );

  //函数定义部分

  // 定义节点的大小
  const getNodeSize = (node: any) => {
    if (
      node.id === hoverHighLightNode ||
      tryGraphData.links.some(
        (link: any) =>
          (link.source.id === node.id && link.target.id === node.id) ||
          (link.source.id === hoverHighLightNode &&
            link.target.id === hoverHighLightNode)
      )
    ) {
      return 12;
    } else {
      return 8;
    }
  };

  // 定义节点的颜色
  const getNodeColor = (node: any) => {
    if (
      node.id === hoverHighLightNode ||
      tryGraphData.links.some(
        (link: any) =>
          (link.source.id === node.id && link.target.id === node.id) ||
          (link.source.id === hoverHighLightNode &&
            link.target.id === hoverHighLightNode)
      )
    ) {
      return "#f00"; // 红色
    } else {
      return { group: node.group };
    }
  };

  //找到点击的节点是source所有的target节点
  const findAllSourceTargetNode = (nodeName: any) => {
    sourceNodeValue = [];
    targetNodeValue = [];
    // console.log(nodeName);
    // console.log(data);
    // console.log(data["links"]);
    data["links"].forEach((item: any) => {
      // console.log(nodeName === item['source'].id)
      // console.log(nodeName === item['target'].id)

      if (nodeName === item["source"].id) {
        // console.log(item["target"].id);
        targetNodeValue.push(item["target"].id);
      } else if (nodeName === item["target"].id) {
        // console.log(item["source"].id);
        sourceNodeValue.push(item["source"].id);
      } else {
        // console.log("111");
      }
    });

    //出现问题，为什么此时sourceNode和targetNode为空
    setSourceNode(sourceNodeValue);
    setTargetNode(targetNodeValue);

    setTimeout(() => {
      console.log(sourceNode, targetNode);
    }, 10000);
    return { sourceNode, targetNode };
  };

  //初始化图像，使其在展示时候，视角在。指定节点上面
  const previewsFistNode = (nodeName: string = "重庆市人民政府") => {
    //在数据中根据节点名找到节点
    console.log(nodeName);

    const nodeSearch = tryGraphData.nodes.filter(
      (node: any) => node.id === nodeName
    );

    console.log(nodeSearch);

    if (nodeName === "重庆市人民政府") {
      findAllSourceTargetNode(nodeName)
      setTimeout(() => {
        const distance = 40;
        // console.log(nodeSearch['0'].x, nodeSearch['0'].y, nodeSearch['0'].z)
        const distRatio =
          1 +
          distance /
          Math.hypot(nodeSearch["0"].x, nodeSearch["0"].y, nodeSearch["0"].z);

        fgRef.current.cameraPosition(
          {
            x: nodeSearch["0"].x * distRatio,
            y: nodeSearch["0"].y * distRatio,
            z: nodeSearch["0"].z * distRatio,
          }, // new position
          nodeSearch["0"], // lookAt ({ x, y, z })
          3000 // ms transition duration
        );
        
      }, 3000);
    } 
    else if (tryGraphData.nodes.some((node: any) => node.id === nodeName)) {
      findAllSourceTargetNode(nodeName)
      const distance = 40;
      // console.log(nodeSearch['0'].x, nodeSearch['0'].y, nodeSearch['0'].z)
      const distRatio =
        1 +
        distance /
        Math.hypot(nodeSearch["0"].x, nodeSearch["0"].y, nodeSearch["0"].z);

      fgRef.current.cameraPosition(
        {
          x: nodeSearch["0"].x * distRatio,
          y: nodeSearch["0"].y * distRatio,
          z: nodeSearch["0"].z * distRatio,
        }, // new position
        nodeSearch["0"], // lookAt ({ x, y, z })
        4000 // ms transition duration
      );
      message.info(`成功找到${nodeName}`);
     
    } else {
      message.warning("该图没有此节点，请重新搜索节点！");
    }
  };

  //点击节点切换到切换到节点视角
  const handleClick = useCallback(
    (node: any) => {
      console.log(node);
      // for (let key in node) {
      //   console.log(key);
      // }
      setKeepNodeInfo(node);
      findAllSourceTargetNode(node.id);
      // Aim at node from outside it
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
    },

    [fgRef]
  );

  //根据父级传过来的search值,定位到该接节点
  const searchNode = (searchNodeValue: any) => {
    console.log(searchNodeValue);
    let node: any = {};
    data["nodes"].forEach((item: any) => {
      if (searchNodeValue === item["id"]) {
        node = item;
      }
    });

    console.log(node);

    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    fgRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      3000 // ms transition duration
    );
  };

  //对节点之间的关系进行梳理（bug解决）在首次进行渲染时候，link.source为名称，但在进行操作时link.source为一个对象
  const relationShipShift = (link: any) => {
    if (link.source.id && link.target.id) {
      let linkSourceName = link.source.id;
      let linkTargetName = link.target.id;
      let relationShip = link.relationship;
      return { linkSourceName, linkTargetName, relationShip };
    } else {
      let linkSourceName = link.source;
      let linkTargetName = link.target;
      let relationShip = link.relationship;
      return { linkSourceName, linkTargetName, relationShip };
    }
  };

  //当鼠标点击后，头节点向尾节点周期性发送粒子
  const emitParticleTime = useCallback(
    (link: any) => {
      if (!linkSame || linkSame["source"] === link["source"]) {
        setLinkSame(link);

        if (linkClickCount === 0) {
          let count = linkClickCount + 1;
          setLinkClickCount(count);

          particleTimer = setInterval(() => {
            fgRef.current.emitParticle(link);
          }, 20);
        } else {
          setLinkClickCount(0);
          setLinkSame(null);
          // fgRef.current.emitParticle(link)
          clearInterval(particleTimer);
        }
      }
    },
    [linkClickCount, linkSame]
  );

  //初始化取得的数据，给每个节点添加它的邻居
  // const dataInitial = () => {
  //   let dataGragh = {...tryGraphData};

  //   //给节点添加neighbor属性和links属性
  //   dataGragh.nodes.forEach((node: any) => {
  //     !node.neighbors && (node.neighbors = []);
  //     !node.links && (node.links = []);
  //   });

  //   console.log(dataGragh.nodes);

  //   dataGragh.links.forEach((link: any) => {
  //     // console.log(link)
  //     let a = dataGragh.nodes.filter((node:any) => {
  //       return link.source === node.id;
  //     });
  //     let b = dataGragh.nodes.filter((node:any) => {
  //       return link.target === node.id;
  //     });

  //     console.log(a, b);

  //     const keys = Object.keys(a["0"]);
  //     console.log(keys);

  //     // a['neighbors'].push(b)

  //     // dataGragh.nodes[0].neighbors?.push()

  //     // 标红的bug，程序能运行，但是在这块说不能类型赋值，但是实际上赋值成功了，体现在useEffect里面
  //     // console.log(a[0]);
  //     a["0"].neighbors?.push(b['0']);
  //     b["0"].neighbors?.push(a['0']);
  //     a["0"].links?.push(b['0']);
  //     b["0"].links?.push(a['0']);
  //   });

  //   setTryGraphData(dataGragh);
  // };

  // 更新高亮值
  // const updateHighlight = () => {
  //   setHighlightNodes(highlightNodes);
  //   setHighlightLinks(highlightLinks);
  // };

  // const handleNodeHover = (node: any) => {
  //   highlightNodes.clear();
  //   highlightLinks.clear();
  //   if (node) {
  //     highlightNodes.add(node);
  //     node.neighbors.forEach((neighbor: any) => highlightNodes.add(neighbor));
  //     node.links.forEach((link: any) => highlightLinks.add(link));
  //   }

  //   setHoverNode(node || null);
  //   updateHighlight();
  // };

  // const handleLinkHover = (link: any) => {
  //   highlightNodes.clear();
  //   highlightLinks.clear();

  //   if (link) {
  //     highlightLinks.add(link);
  //     highlightNodes.add(link.source);
  //     highlightNodes.add(link.target);
  //   }

  //   updateHighlight();
  // };

  // const paintRing = useCallback(
  //   (node: any, ctx: any) => {
  //     // add ring just for highlighted nodes
  //     ctx.beginPath();
  //     ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
  //     ctx.fillStyle = node === hoverNode ? "red" : "orange";
  //     ctx.fill();
  //   },
  //   [hoverNode]
  // );

  //返回控制图例的控制数量
  const handleCategoryClick = (category: any) => {
    setSelectedCategories((prevCategories: any) => {
      const categoryIndex = prevCategories.indexOf(category);
      if (categoryIndex === -1) {
        return [...prevCategories, category];
      } else {
        return prevCategories.filter((c: any) => c !== category);
      }
    });

    //  setTimeout(()=>{
    //   console.log(selectedCategories)
    //  },2000)
  };

  return (
    <>

      <div style={{ position: 'relative' }}>
        <List
          style={{ position: 'absolute', top: 0, left: 0 ,zIndex:2}}
          size="small"
          bordered
          dataSource={categories}
          renderItem={(item) => (
            <List.Item>
              <Switch
                checked={selectedCategories.includes(item)}
                onClick={() => {
                  handleCategoryClick(item);
                }}
              />
              {item}
            </List.Item>
          )}
        />

        
          <ForceGraph3D
            ref={fgRef}
            graphData={tryGraphData}
            nodeRelSize={NODE_R}
            // dagMode="lr"
            // nodeSpacing={50}

            linkVisibility={(link: any) =>
              selectedCategories.length === 0 || categoriesLength === selectedCategories.length
            }
            nodeVisibility={(node: any) =>
              selectedCategories.length === 0 ||
              selectedCategories.includes(node.group)
            }
            // nodeCanvasObjectMode={node => highlightNodes.has(node) ? 'before' : undefined}
            // nodeCanvasObject={paintRing}
            onNodeHover={debounce((node: any) => {
              const hightNode = node ? node.id : null;
              console.log(hightNode);

              setHoverHighLightNode(hightNode);

              // const hoverAfterData = tryGraphData
              const hoverAfterData = { ...tryGraphData };

              // setHoverAfterData(NewhoverAfterData)

              console.log(hoverAfterData);

              //为什么需要加id才能得到节点
              hoverAfterData.nodes = hoverAfterData.nodes.filter((n: any) => {
                return (
                  n.id === hightNode ||
                  hoverAfterData.links.some(
                    (l: any) =>
                      (l.source.id === hightNode && l.target.id === n.id) ||
                      (l.source.id === n.id && l.target.id === hightNode)
                  )
                );
              });

              hoverAfterData.links = hoverAfterData.links.filter((l: any) => {
                return l.source.id === hightNode || l.target.id === hightNode;
              });

              console.log(hoverAfterData);

              setNewHoverAfterData(hoverAfterData);
            }, 500)}
            // onLinkHover={handleLinkHover}
            //设置线宽
            linkWidth={(link: any) => {
              return hoverHighLightNode === link.source.id ||
                hoverHighLightNode === link.target.id
                ? 0.5
                : 0.3;
            }}
            // nodeThreeObject={(node:any) => {
            //   const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            //     color: node.color,
            //   }));
            //   sprite.scale.set(getNodeSize(node), getNodeSize(node), 1);
            //   return sprite;
            // }}
            // linkWidth = {5}
            //设置背景
            // backgroundColor="gray"
            backgroundColor="white"
            linkColor={(link: any) => {
              // console.log(hoverHighLightNode)
              return hoverHighLightNode &&
                (link.source.id === hoverHighLightNode ||
                  link.target.id === hoverHighLightNode)
                ? "yellow"
                : "black";
            }}
            // nodeLabel="id"
            nodeAutoColorBy={"group"}
            // nodeColor={(node:any)=>{
            //   return newHoverAfterData.nodes.includes(node)?'black':''
            // }}
            // nodeColor={(node) =>
            //   {
            //     // if(hoverHighLightNode && node.id === hoverHighLightNode){
            //     //   return "blue"
            //     // }
            //     return hoverHighLightNode && node.id === hoverHighLightNode? 'blue' : ''
            //   }
            // }
            // nodeAutoColorBy="user"
            // 添加标签信息

            //增大节点间的距离
            // d3ForceLink={{ distance: 100, strength: 1 }}

            //增大距离，但是实现不了

            //添加关系
            linkThreeObjectExtend={true}
            linkThreeObject={(link: any) => {
              // extend link with text sprite
              // console.log(link)

              //用于返回与初始值不同时候的值，在最初渲染时link.source为节点的id,在进行操作之后link.source为节点对象
              const { linkSourceName, linkTargetName, relationShip } =
                relationShipShift(link);

              const sprite = new SpriteText(`关系:${relationShip}`);
              sprite.color = "black";
              sprite.textHeight = 2.5;
              return sprite;
            }}
            //当鼠标触摸到节点时，显示节点的text
            nodeLabel="id"
            extraRenderers={extraRenderers}
            //给节点添加标签，并且颜色与节点一样
            nodeThreeObject={(node: any) => {
              const nodeEl = document.createElement("div");
              nodeEl.textContent = node.id;
              nodeEl.style.color = node.color;
              nodeEl.className = nodeLabelStyle.nodelabel;
              nodeEl.style.backgroundColor = "transparent";

              // const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
              //   color: node.color,
              // }));
              // sprite.scale.set(getNodeSize(node), getNodeSize(node), 1);
              // // return sprite;

              return new CSS2DObject(nodeEl);
            }}
            //使得查看节点间关系随着位置的变化而变化
            linkPositionUpdate={(sprite, { start, end }) => {
              //红线问题尚未解决
              const middlePos = Object.assign(
                ...["x", "y", "z"].map((c: any) => ({
                  [c]: start[c] + (end[c] - start[c]) / 2,
                }))
              );

              // Position sprite
              Object.assign(sprite.position, middlePos);
            }}
            //使得可以用鼠标对节点进行拖拽
            onNodeDragEnd={(node) => {
              node.fx = node.x;
              node.fy = node.y;
              node.fz = node.z;
            }}
            nodeThreeObjectExtend={true}
            onNodeClick={handleClick}
            //设置点击边后发射球的颜色
            linkDirectionalParticleColor={() => "green"}
            //设置点击后边发射粒子宽度
            linkDirectionalParticleWidth={() => 2}
            //点击边后触发emit的函数
            onLinkClick={(link) => {
              emitParticleTime(link);
            }}
            linkDirectionalArrowLength={2}
            linkDirectionalArrowRelPos={1}
            linkCurvature={0.2}
          />
       

      </div>


     
      {/* 抽屉 */}
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={props.closeDrawer}
        open={props.isDrawer}
      >
        <p
          className="site-description-item-profile-p"
          style={{ marginBottom: 24 }}
        >
          Node Information
        </p>

        <p className="site-description-item-profile-p">{keepNodeInfo.id}</p>

        <p className="site-description-item-profile-p">以该节点作为头节点：</p>

        {sourceNodeValue.map((item: any, index) => {
          console.log(item);
          return (
            <Row key={index}>
              <Col span={12}>
                <DescriptionItem title="sourceNode" content={item} />
              </Col>
              <Col span={12}>
                <DescriptionItem title="Target" content={keepNodeInfo.id} />
              </Col>
            </Row>
          );
        })}
        <Divider />

        <p className="site-description-item-profile-p">以该节点作为尾节点：</p>
        {targetNodeValue.map((item: any, index) => {
          console.log(item);
          return (
            <Row key={index}>
              <Col span={12}>
                <DescriptionItem title="sourceNode" content={keepNodeInfo.id} />
              </Col>
              <Col span={12}>
                <DescriptionItem title="Target" content={item} />
              </Col>
            </Row>
          );
        })}
      </Drawer>
    </>
  );
}
