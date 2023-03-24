import React, { useEffect, useRef, useState, useCallback } from "react";
import G6 from "@antv/g6";
import {
  Col,
  Form,
  Row,
  Input,
  Cascader,
  Button,
  Card,
  Drawer,
  Space,
  Divider,
  AutoComplete,
  message,
} from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import styled from "styled-components";
// import { data } from "../../../../component/homeIndex/Graph/data";
import data  from '../../../../mockDate/realdatacertify.json'
// import { setTimeout } from "timers";
// import { title } from "process";
const { Search } = Input;

let inputNodeValue: string[] = [];

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

let graph: any = null;

export default function SearchGragh(props: any) {
  const graphRef: any = useRef();
  const formRef: any = useRef();
  const buttonRef: any = useRef();
  const [nodeInfo, setNodeInfo] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const onSearch = (value: string) => console.log(value);

  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

  const [nodeValueOne, setNodeValueOne] = useState("");
  const [nodeValueTwo, setNodeValueTwo] = useState("");
  const [optionsNode1, setOptionsNode1] = useState<{ value: string }[]>([]);
  const [optionsNode2, setOptionsNode2] = useState<{ value: string }[]>([]);

  const mockVal = (str: string, repeat = 1) => ({
    value: str.repeat(repeat),
  });

  const onNodePathSearch1 = (searchText: string) => {
    setOptionsNode1(
      !searchText
        ? []
        : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]
    );
  };

  const onNodePathSearch2 = (searchText: string) => {
    setOptionsNode2(
      !searchText
        ? []
        : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)]
    );
  };

  const onNodePathSelect1 = (data: string) => {
    console.log("onSelect", data);
  };

  const onNodePathSelect2 = (data: string) => {
    console.log("onSelect", data);
  };

  const onNodePathChange1 = useCallback((data: string) => {
    console.log(typeof data);

    graph.getNodes().forEach((node:any)=>{
      // console.log(node)
      if(node._cfg.model.name === data)
      inputNodeValue[0] = node._cfg.model.id
      console.log(inputNodeValue)
    })

    // let findNodeId = graph.findByN(data);

    // if (findNodeId) {
    //   console.log(findNodeId, [...selectedNodeIds, findNodeId.getID()]);
    //   let selectNode: string[] = [...selectedNodeIds];
    //   // console.log(selectNode)
    //   selectNode[0] = findNodeId.getID();
    //   inputNodeValue[0] = findNodeId.getID();
    //   // console.log(selectNode)
    //   setSelectedNodeIds(selectNode);
    //   // setSelectedNodeIds
    //   //      setTimeout(()=>{
    //   //   console.log(selectedNodeIds)
    //   //  },5000)
    // }

    setNodeValueOne(data);
  }, []);

  const onNodePathChange2 = (data: string) => {
    graph.getNodes().forEach((node:any)=>{
      if(node._cfg.model.name === data)
      inputNodeValue[1] = node._cfg.model.id
      console.log(inputNodeValue)
    })
    // let findNodeId = graph.findById(encodeURI(data));

    // if (findNodeId) {
    //   console.log(findNodeId);
    //   let selectNode: string[] = [...selectedNodeIds];
    //   selectNode[1] = findNodeId.getID();
    //   inputNodeValue[1] = findNodeId.getID();

    //   console.log(inputNodeValue);
    //   setSelectedNodeIds(selectNode);
    // }
    // setNodeValueOne(data);
    setNodeValueTwo(data);
  };

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
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
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

    if (graph) {
      graph.destroy();
    }

    graph = new G6.Graph({
      container: graphRef.current,
      width,
      height,
      layout: {
        type: "force",
      },
      linkCenter: true,
      animate: true,
      modes: {
        default: ["click-select", "drag-canvas", "drag-node", "zoom-canvas"],
      },
      fitView: true,
    });

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

    // 编码中文 ID
    // const encodedData = {
    //   nodes: data.nodes.map((node) => ({
    //     ...node,
    //     id: encodeURI(node.id),
    //   })),
    //   edges: data.edges.map((edge) => ({
    //     ...edge,
    //     source: encodeURI(edge.source),
    //     target: encodeURI(edge.target),
    //   })),
    // };

    graph.data(
      // {
      // nodes: data.nodes,
      // edges: data.links.map(function (edge: any, i: any) {
      //   edge.id = 'edge' + i;
      //   return Object.assign({}, edge);
      // })}
      data
    );

    graph.render();

    buttonRef.current.addEventListener("click", (e: any) => {
      console.log(selectedNodeIds);

      if (inputNodeValue.length !== 2) {
        alert("Please select TWO nodes!\n\r请选择有且两个节点！");
        return;
      }
      clearStates();
      const { findShortestPath } = G6.Algorithm as any;
      // path 为其中一条最短路径，allPath 为所有的最短路径
      const { path, allPath } = findShortestPath(
        data,
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
        <Divider />
        <Form layout={"inline"}>
          <Form.Item label="实体1">
            <AutoComplete
              value={nodeValueOne}
              options={optionsNode1}
              style={{ width: 200 }}
              onSelect={onNodePathSelect1}
              onSearch={onNodePathSearch1}
              onChange={onNodePathChange1}
              placeholder="请输入实体名"
            ></AutoComplete>
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
            ></AutoComplete>
          </Form.Item>
          <Form.Item>
            <Button type="primary" ref={buttonRef}>
              查找实体最短路径
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card style={{ marginTop: "20px" }}>
        <GraphContainer ref={graphRef}>
          <Space size={8}>
            <Button
              type="primary"
              onClick={() => {
                showDrawer();
              }}
            >
              查看所选节点信息
            </Button>
          </Space>
        </GraphContainer>
        <Drawer
          title="节点信息"
          width={720}
          placement="right"
          onClose={onClose}
          open={open}
        >
          {Array.from(nodeInfo).map((item, index) => (
            <div key={index}>{item.id}</div>
          ))}
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
