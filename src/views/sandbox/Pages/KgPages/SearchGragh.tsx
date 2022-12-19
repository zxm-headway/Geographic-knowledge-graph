import React, { useEffect, useRef ,useState} from "react";
import G6 from "@antv/g6";
import { Col, Form, Row, Input, Cascader, Button, Card,Drawer, Space } from "antd";
import { AudioOutlined ,PoweroffOutlined} from "@ant-design/icons";
import styled from "styled-components";
import { title } from "process";
const { Search } = Input;

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}
const options: Option[] = [
  {
    label: "Light",
    value: "light",
    children: new Array(20)
      .fill(null)
      .map((_, index) => ({ label: `Number ${index}`, value: index })),
  },
  {
    label: "Bamboo",
    value: "bamboo",
    children: [
      {
        label: "Little",
        value: "little",
        children: [
          {
            label: "Toy Fish",
            value: "fish",
          },
          {
            label: "Toy Cards",
            value: "cards",
          },
          {
            label: "Toy Bird",
            value: "bird",
          },
        ],
      },
    ],
  },
];

const onChange = (value: any) => {
  console.log(value);
};

export default function SearchGragh(props: any) {
  const graphRef: any = useRef();
  const formRef: any = useRef();
  const buttonRef:any = useRef();
  const [nodeInfo, setNodeInfo] = useState<any[]>([])
  const [open, setOpen] = useState<boolean>(false);
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const onSearch = (value: string) => console.log(value);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log(111);
  };

  const handleReset = () => {
    const fields = formRef.current.getFieldsValue();
    console.log(fields);
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = [];
        } else {
          fields[item] = undefined;
        }
      }
    }
    formRef.current.setFieldsValue(fields);
    handleSubmit();
  };

  const enterLoading = (index: number) => {
    setLoadings(prevLoadings => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings(prevLoadings => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
  };

  useEffect(() => {
    const container = graphRef.current;
    const width = container.scrollWidth;
    const height = (container.scrollHeight || 500) - 40;

    const graph = new G6.Graph({
      container: graphRef.current,
      width,
      height,
      linkCenter: true,
      animate: true,
      modes: {
        default: ["click-select", "drag-canvas", "drag-node", "zoom-canvas"],
      },
      fitView: true,
    });
    fetch(
      "https://gw.alipayobjects.com/os/bmw-prod/b0ca4b15-bd0c-43ec-ae41-c810374a1d55.json"
    ).then((res) => res.json())
      .then((data) => {
        const clearStates = () => {
          graph.getNodes().forEach((node) => {
            graph.clearItemStates(node);
          });
          graph.getEdges().forEach((edge) => {
            graph.clearItemStates(edge);
          });
        };

        graph.on("canvas:click", (e) => {
          clearStates();
        });

        graph.data(data);
        graph.render();

       
        buttonRef.current.addEventListener("click", (e:any) => {
          const selectedNodes = graph.findAllByState("node", "selected");

          console.log(selectedNodes)
          let nodeInfoList:any[] =[]
          selectedNodes.forEach( (item,index) => {
            let selectNode = {id:item._cfg?.id}
            nodeInfoList.push(selectNode)

          })

          setTimeout(()=>{
         
          console.log(nodeInfo)
         },1000)

         setNodeInfo([...nodeInfoList])

         console.log(nodeInfo)

          if (selectedNodes.length !== 2) {
            alert("Please select TWO nodes!\n\r请选择有且两个节点！");
            return;
          }
          clearStates();
          const { findShortestPath } = G6.Algorithm as any ;
          // path 为其中一条最短路径，allPath 为所有的最短路径
          const { path, allPath } = findShortestPath(
            data,
            selectedNodes[0].getID(),
            selectedNodes[1].getID()
          );

          const pathNodeMap:any = {};
          path.forEach((id:any) => {
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
      });
  }, []);

  return (
    <div>
      <Card style={{ textAlign: "left" }} title="请输入要查找的地点信息">
        <Form ref={formRef}>
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <Form.Item name="search">
                <Search
                  placeholder="input search text"
                  onSearch={onSearch}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Form.Item name="cascader">
                <Cascader
                  style={{ width: "100%" }}
                  options={options}
                  onChange={onChange}
                  multiple
                  maxTagCount="responsive"
                />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={6}>
              <Button
                type="primary"
                htmlType="submit"
                className="margin-right"
                onClick={() => handleSubmit}
              >
                Search
              </Button>
              <Button onClick={handleReset}>Reset</Button>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card style={{ marginTop: "20px" } }>
        <GraphContainer ref={graphRef}>
        
       <Space size={8}>
       <Button
          ref={buttonRef}
          type="primary"
          icon={<PoweroffOutlined />}
          loading={loadings[1]}
          onClick={() => enterLoading(1)}
        >
          点击查找最短路径
        </Button>
        <Button type="primary" onClick={()=>{showDrawer()}}>查看所选节点信息</Button>
       </Space>
        </GraphContainer>
        <Drawer title="节点信息" width={720} placement="right" onClose={onClose} open={open}>
         { Array.from(nodeInfo).map((item,index)=> <div key={index}>{item.id}</div>
         )}
        </Drawer>
      </Card>
    </div>
  );
}

const GraphContainer = styled.div`
  height: 45vh;
  width: 100%;
  blackground: gary;
`;
