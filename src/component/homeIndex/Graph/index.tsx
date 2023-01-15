import G6, {
  ComboConfig,
  Edge,
  EdgeConfig,
  Graph,
  GraphData,
  IEdge,
  INode,
  Item,
  NodeConfig,
  TreeGraphData,
} from "@antv/g6";
import Algorithm from "@antv/algorithm";
import { uniqueId } from "@antv/util";

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  colorSets,
  DEFAULTAGGREGATEDNODESIZE,
  DEFAULTNODESIZE,
  NODESIZEMAPPING,
  NODE_LIMIT,
  SMALLGRAPHLABELMAXLENGTH,
} from "./config";
import {
  clearFocusItemState,
  clearFocusEdgeState,
  descendCompare,
  formatText,
  labelFormatter,
} from "./utils";
import { ClusterData } from "./types";
import { global } from "./config";
import { observer } from "mobx-react";
import { GraphModelContext } from "../context/GraphModelContext";
import styled from "styled-components";
import { data } from "./data";

import { useMutationObserver } from "./hooks/useMutationObserver";
import { Button, Layout, Space } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import MyShowInfo from "../model/showCluster";

const { louvain, findShortestPath } = Algorithm;
interface CustomGraphProps { }

const CustomGraph: React.FC<CustomGraphProps> = observer(() => {
  const model = useContext(GraphModelContext);
  const graphRef = useRef<Graph | null>(null);

  const [clusterNodeData, setClusterNodeData] = useState<GraphData>(
    null as any
  );
  // 控制按cluster分类展示图
  const [displayClusterGroup, setDisplayClusterGroup] = useState<string[]>([]);
  let graph: Graph = null as any;

  let labelMaxLength = SMALLGRAPHLABELMAXLENGTH;

  let nodeMap: Record<string, NodeConfig & { [key: string]: any }> = {};
  let aggregatedNodeMap: Record<string, NodeConfig & { [key: string]: any }> =
    {};
  let hiddenItemIds: any[] = []; // 隐藏的元素 id 数组

  let cachePositions: Record<string, { x: string; y: string }> = {};
  let manipulatePosition: { x: any; y: any } | undefined = undefined;
  let layout: {
    type: string;
    instance: any;
    destroyed: boolean;
  } = {
    type: "",
    instance: null,
    destroyed: true,
  };
  let originData: any;
  let currentUnproccessedData: GraphData = { nodes: [], edges: [] };
  let largeGraphMode = true;
  let expandArray: any[] = [];
  let collapseArray: any[] = [];
  let shiftKeydown = false;
  let CANVAS_WIDTH = 1200,
    CANVAS_HEIGHT = 800;
  const container = React.useRef<HTMLDivElement>(null);

  const processNodesEdges = (
    nodes: NodeConfig[],
    edges: EdgeConfig[],
    width: number,
    height: number,
    largeGraphMode: boolean,
    edgeLabelVisible: boolean,
    isNewGraph = false
  ) => {
    if (!nodes || nodes.length === 0) return {};
    const currentNodeMap: Record<string, NodeConfig> = {};
    let maxNodeCount = -Infinity;
    const paddingRatio = 0.3;
    const paddingLeft = paddingRatio * width;
    const paddingTop = paddingRatio * height;
    nodes.forEach((node: any) => {
      node.type = node.level === 0 ? "real-node" : "aggregated-node";
      node.isReal = node.level === 0 ? true : false;
      node.label = `${node.id}`;
      node.labelLineNum = undefined;
      node.oriLabel = node.label;
      node.label = formatText(node.label, SMALLGRAPHLABELMAXLENGTH, "...");
      node.degree = 0;
      node.inDegree = 0;
      node.outDegree = 0;
      if (currentNodeMap[node.id]) {
        console.warn("node exists already!", node.id);
        node.id = `${node.id}${Math.random()}`;
      }
      currentNodeMap[node.id] = node;
      if (node.count > maxNodeCount) maxNodeCount = node.count;
      const cachePosition = cachePositions
        ? cachePositions[node.id]
        : undefined;
      if (cachePosition) {
        node.x = cachePosition.x;
        node.y = cachePosition.y;
        node.new = false;
      } else {
        node.new = isNewGraph ? false : true;
        if (manipulatePosition && !node.x && !node.y) {
          node.x =
            manipulatePosition.x + 30 * Math.cos(Math.random() * Math.PI * 2);
          node.y =
            manipulatePosition.y + 30 * Math.sin(Math.random() * Math.PI * 2);
        }
      }
    });

    let maxCount = -Infinity;
    let minCount = Infinity;
    // let maxCount = 0;
    edges.forEach((edge: any) => {
      // to avoid the dulplicated id to nodes
      if (!edge.id) edge.id = `edge-${uniqueId()}`;
      else if (edge.id.split("-")[0] !== "edge") edge.id = `edge-${edge.id}`;
      // TODO: delete the following line after the queried data is correct
      if (!currentNodeMap[edge.source] || !currentNodeMap[edge.target]) {
        console.warn(
          "edge source target does not exist",
          edge.source,
          edge.target,
          edge.id
        );
        return;
      }
      const sourceNode: any = currentNodeMap[edge.source];
      const targetNode: any = currentNodeMap[edge.target];

      if (!sourceNode || !targetNode)
        console.warn(
          "source or target is not defined!!!",
          edge,
          sourceNode,
          targetNode
        );

      // calculate the degree
      sourceNode.degree++;
      targetNode.degree++;
      sourceNode.outDegree++;
      targetNode.inDegree++;

      if (edge.count > maxCount) maxCount = edge.count;
      if (edge.count < minCount) minCount = edge.count;
    });

    nodes.sort(descendCompare(NODESIZEMAPPING));
    const maxDegree = nodes[0].degree || 1;

    const descreteNodes: NodeConfig[] = [];
    nodes.forEach((node: any, i) => {
      // assign the size mapping to the outDegree
      const countRatio = node.count / maxNodeCount;
      const isRealNode = node.level === 0;
      node.size = isRealNode ? DEFAULTNODESIZE : DEFAULTAGGREGATEDNODESIZE;
      node.isReal = isRealNode;
      node.labelCfg = {
        position: "bottom",
        offset: 5,
        style: {
          fill: global.node.labelCfg.style.fill,
          fontSize: 6 + countRatio * 6 || 12,
          stroke: global.node.labelCfg.style.stroke,
          lineWidth: 3,
        },
      };

      if (!node.degree) {
        descreteNodes.push(node);
      }
    });

    const countRange = maxCount - minCount;
    const minEdgeSize = 1;
    const maxEdgeSize = 7;
    const edgeSizeRange = maxEdgeSize - minEdgeSize;
    edges.forEach((edge: any) => {
      // set edges' style
      const targetNode: any = currentNodeMap[edge.target];

      const size =
        ((edge.count - minCount) / countRange) * edgeSizeRange + minEdgeSize ||
        1;
      edge.size = size;

      const arrowWidth = Math.max(size / 2 + 2, 3);
      const arrowLength = 10;
      const arrowBeging = targetNode.size + arrowLength;
      let arrowPath: any = `M ${arrowBeging},0 L ${arrowBeging + arrowLength
        },-${arrowWidth} L ${arrowBeging + arrowLength},${arrowWidth} Z`;
      let d = targetNode.size / 2 + arrowLength;
      if (edge.source === edge.target) {
        edge.type = "loop";
        arrowPath = undefined;
      }
      const sourceNode: any = currentNodeMap[edge.source];
      const isRealEdge = targetNode.isReal && sourceNode.isReal;
      edge.isReal = isRealEdge;
      const stroke = isRealEdge
        ? global.edge.style.realEdgeStroke
        : global.edge.style.stroke;
      const opacity = isRealEdge
        ? global.edge.style.realEdgeOpacity
        : global.edge.style.strokeOpacity;
      const dash = Math.max(size, 2);
      const lineDash = isRealEdge ? undefined : [dash, dash];
      edge.style = {
        stroke,
        strokeOpacity: opacity,
        cursor: "pointer",
        lineAppendWidth: Math.max(edge.size || 5, 5),
        fillOpacity: 1,
        lineDash,
        endArrow: arrowPath
          ? {
            path: arrowPath,
            d,
            fill: stroke,
            strokeOpacity: 0,
          }
          : false,
      };
      edge.labelCfg = {
        autoRotate: true,
        style: {
          stroke: global.edge.labelCfg.style.stroke,
          fill: global.edge.labelCfg.style.fill,
          lineWidth: 4,
          fontSize: 12,
          lineAppendWidth: 10,
          opacity: 1,
        },
      };
      if (!edge.oriLabel) edge.oriLabel = edge.label;
      if (largeGraphMode || !edgeLabelVisible) edge.label = "";
      else {
        edge.label = labelFormatter(edge.label, labelMaxLength);
      }

      // arrange the other nodes around the hub
      const sourceDis = sourceNode.size / 2 + 20;
      const targetDis = targetNode.size / 2 + 20;
      if (sourceNode.x && !targetNode.x) {
        targetNode.x =
          sourceNode.x + sourceDis * Math.cos(Math.random() * Math.PI * 2);
      }
      if (sourceNode.y && !targetNode.y) {
        targetNode.y =
          sourceNode.y + sourceDis * Math.sin(Math.random() * Math.PI * 2);
      }
      if (targetNode.x && !sourceNode.x) {
        sourceNode.x =
          targetNode.x + targetDis * Math.cos(Math.random() * Math.PI * 2);
      }
      if (targetNode.y && !sourceNode.y) {
        sourceNode.y =
          targetNode.y + targetDis * Math.sin(Math.random() * Math.PI * 2);
      }

      if (!sourceNode.x && !sourceNode.y && manipulatePosition) {
        sourceNode.x =
          manipulatePosition.x + 30 * Math.cos(Math.random() * Math.PI * 2);
        sourceNode.y =
          manipulatePosition.y + 30 * Math.sin(Math.random() * Math.PI * 2);
      }
      if (!targetNode.x && !targetNode.y && manipulatePosition) {
        targetNode.x =
          manipulatePosition.x + 30 * Math.cos(Math.random() * Math.PI * 2);
        targetNode.y =
          manipulatePosition.y + 30 * Math.sin(Math.random() * Math.PI * 2);
      }
    });

    const descreteNodeCenter = {
      x: width - paddingLeft,
      y: height - paddingTop,
    };
    descreteNodes.forEach((node) => {
      if (!node.x && !node.y) {
        node.x =
          descreteNodeCenter.x + 30 * Math.cos(Math.random() * Math.PI * 2);
        node.y =
          descreteNodeCenter.y + 30 * Math.sin(Math.random() * Math.PI * 2);
      }
    });

    G6.Util.processParallelEdges(
      edges,
      12.5,
      "custom-quadratic",
      "custom-line"
    );
    return {
      maxDegree,
      edges,
    };
  };

  const getForceLayoutConfig = (
    graph: { getEdges: () => any[]; refreshPositions: () => void },
    largeGraphMode: boolean,
    configSettings?: { preventOverlap: boolean } | undefined | any
  ) => {
    let {
      linkDistance,
      edgeStrength,
      nodeStrength,
      nodeSpacing,
      preventOverlap,
      nodeSize,
      collideStrength,
      alpha,
      alphaDecay,
      alphaMin,
    } = configSettings || { preventOverlap: true };

    if (!linkDistance && linkDistance !== 0) linkDistance = 225;
    if (!edgeStrength && edgeStrength !== 0) edgeStrength = 50;
    if (!nodeStrength && nodeStrength !== 0) nodeStrength = 200;
    if (!nodeSpacing && nodeSpacing !== 0) nodeSpacing = 5;

    const config: any = {
      type: "gForce",
      minMovement: 0.01,
      maxIteration: 5000,
      preventOverlap,
      damping: 0.99,

      gpuEnabled: largeGraphMode,
      linkDistance: (d: {
        source: string | number;
        target: string | number;
      }) => {
        let dist = linkDistance;
        const sourceNode = nodeMap[d.source] || aggregatedNodeMap[d.source];
        const targetNode = nodeMap[d.target] || aggregatedNodeMap[d.target];
        // // 两端都是聚合点
        // if (sourceNode.level && targetNode.level) dist = linkDistance * 3;
        // // 一端是聚合点，一端是真实节点
        // else if (sourceNode.level || targetNode.level) dist = linkDistance * 1.5;
        if (!sourceNode.level && !targetNode.level) dist = linkDistance * 0.3;
        return dist;
      },
      edgeStrength: (d: {
        source: string | number;
        target: string | number;
      }) => {
        const sourceNode = nodeMap[d.source] || aggregatedNodeMap[d.source];
        const targetNode = nodeMap[d.target] || aggregatedNodeMap[d.target];
        // 聚合节点之间的引力小
        if (sourceNode.level && targetNode.level) return edgeStrength / 2;
        // 聚合节点与真实节点之间引力大
        if (sourceNode.level || targetNode.level) return edgeStrength;
        return edgeStrength;
      },
      nodeStrength: (d: { degree: number; level: any }) => {
        // 给离散点引力，让它们聚集
        if (d.degree === 0) return -10;
        // 聚合点的斥力大
        if (d.level) return nodeStrength * 2;
        return nodeStrength;
      },
      nodeSize: (d: { size: any }) => {
        if (!nodeSize && d.size) return d.size;
        return 50;
      },
      nodeSpacing: (d: { degree: number; level: any }) => {
        if (d.degree === 0) return nodeSpacing * 2;
        if (d.level) return nodeSpacing;
        return nodeSpacing;
      },
      onLayoutEnd: () => {
        if (largeGraphMode) {
          graph
            .getEdges()
            .forEach(
              (edge: {
                oriLabel: string | any;
                update: (arg0: { label: string | any }) => void;
              }) => {
                if (!edge.oriLabel) return;
                edge.update({
                  label: labelFormatter(edge.oriLabel, labelMaxLength),
                });
              }
            );
        }
      },
      tick: () => {
        graph.refreshPositions();
      },
    };

    if (nodeSize) config["nodeSize"] = nodeSize;
    if (collideStrength) config["collideStrength"] = collideStrength;
    if (alpha) config["alpha"] = alpha;
    if (alphaDecay) config["alphaDecay"] = alphaDecay;
    if (alphaMin) config["alphaMin"] = alphaMin;

    return config;
  };

  const hideItems = (graph: { hideItem: (arg0: any) => void }) => {
    hiddenItemIds.forEach((id) => {
      graph.hideItem(id);
    });
  };

  const showItems = (graph: {
    getNodes: () => any[];
    showItem: (arg0: any) => void;
    getEdges: () => any[];
  }) => {
    if (!graph) {
      return;
    }
    graph.getNodes().forEach((node: { isVisible: () => any }) => {
      if (!node.isVisible()) graph.showItem(node);
    });
    graph
      .getEdges()
      .forEach(
        (edge: { isVisible: () => any; showItem: (arg0: any) => void }) => {
          if (!edge.isVisible()) edge.showItem(edge);
        }
      );
    hiddenItemIds = [];
  };

  const handleRefreshGraph = (
    graph: {
      getNodes: () => any[];
      getEdges: () => any[];
      changeData: (data: GraphData) => void;
    },
    graphData: GraphData | any,
    width: number,
    height: number,
    largeGraphMode: boolean,
    edgeLabelVisible: boolean,
    isNewGraph: boolean | undefined
  ) => {
    if (!graphData || !graph) return;
    clearFocusItemState(graph);
    // reset the filtering
    graph
      .getNodes()
      .forEach((node: { isVisible: () => any; show: () => void }) => {
        if (!node.isVisible()) node.show();
      });
    graph
      .getEdges()
      .forEach((edge: { isVisible: () => any; show: () => void }) => {
        if (!edge.isVisible()) edge.show();
      });

    let nodes: NodeConfig[] = [],
      edges: EdgeConfig[] | any = [];

    nodes = graphData?.nodes;
    const processRes = processNodesEdges(
      nodes,
      graphData.edges || [],
      width,
      height,
      largeGraphMode,
      edgeLabelVisible,
      isNewGraph
    );

    edges = processRes.edges;

    graph.changeData({ nodes, edges });

    hideItems(graph);
    graph.getNodes().forEach((node: { toFront: () => void }) => {
      node.toFront();
    });

    layout.instance.stop();

    // 在大数据量时，使用 GPU 布局
    if (nodes.length > 100) {
      layout.instance.destroy();
      const layoutConfig: any = getForceLayoutConfig(graph, true);
      layoutConfig.center = [width / 2, height / 2];
      layout.instance = new G6.Layout["gForce"](layoutConfig);
    }

    // force 需要使用不同 id 的对象才能进行全新的布局，否则会使用原来的引用。因此复制一份节点和边作为 force 的布局数据
    layout.instance.init({
      nodes: graphData.nodes,
      edges,
    });

    layout.instance.minMovement = 0.0001;
    layout.instance.getMass = (d: { id: string | number }) => {
      const cachePosition = cachePositions[d.id];
      if (cachePosition) return 5;
      return 1;
    };

    layout.instance.execute();
    return { nodes, edges };
  };

  const getMixedGraph = (
    aggregatedData: { clusters: any[]; clusterEdges: any[] },
    originData: GraphData,
    nodeMap: Record<string, NodeConfig & { clusterId: string }>,
    aggregatedNodeMap: Record<string, NodeConfig & { clusterId: string }>,
    expandArray: any[],
    collapseArray: any[]
  ) => {
    let nodes: any[] = [],
      edges: { source: any; target: any; id: string; label: string }[] = [];

    const expandMap = {},
      collapseMap = {};
    expandArray.forEach((expandModel: { id: string | number }) => {
      expandMap[expandModel.id] = true;
    });
    collapseArray.forEach((collapseModel: { id: string | number }) => {
      collapseMap[collapseModel.id] = true;
    });

    aggregatedData.clusters.forEach(
      (cluster: { id: string | number; nodes: any }, i: any) => {
        if (expandMap[cluster.id]) {
          nodes = nodes.concat(cluster.nodes);
          aggregatedNodeMap[cluster.id].expanded = true;
        } else {
          nodes.push(aggregatedNodeMap[cluster.id]);
          aggregatedNodeMap[cluster.id].expanded = false;
        }
      }
    );
    originData.edges?.forEach((edge: EdgeConfig) => {
      const isSourceInExpandArray = expandMap[nodeMap[edge.source].clusterId];
      const isTargetInExpandArray = expandMap[nodeMap[edge.target].clusterId];
      if (isSourceInExpandArray && isTargetInExpandArray) {
        edges.push(edge);
      } else if (isSourceInExpandArray) {
        const targetClusterId = nodeMap[edge.target].clusterId;
        const vedge = {
          source: edge.source,
          target: targetClusterId,
          id: `edge-${uniqueId()}`,
          label: "",
        };
        edges.push(vedge);
      } else if (isTargetInExpandArray) {
        const sourceClusterId = nodeMap[edge.source].clusterId;
        const vedge = {
          target: edge.target,
          source: sourceClusterId,
          id: `edge-${uniqueId()}`,
          label: "",
        };
        edges.push(vedge);
      }
    });
    aggregatedData.clusterEdges.forEach(
      (edge: { source: string | number; target: string | number }) => {
        if (expandMap[edge.source] || expandMap[edge.target]) return;
        else edges.push(edge);
      }
    );
    return { nodes, edges };
  };

  const getNeighborMixedGraph = (
    centerNodeModel: { x: any; y: any; clusterId: any },
    step: number,
    originData: { nodes: string | any[]; edges: string | any[] },
    clusteredData: ClusterData,
    currentData: GraphData,
    nodeMap: Record<string, NodeConfig & { clusterId: string }>,
    aggregatedNodeMap: Record<string, NodeConfig & { clusterId: string }>,
    maxNeighborNumPerNode = 5
  ) => {
    // update the manipulate position for center gravity of the new nodes
    manipulatePosition = { x: centerNodeModel.x, y: centerNodeModel.y };

    // the neighborSubGraph does not include the centerNodeModel. the elements are all generated new nodes and edges
    const neighborSubGraph = generateNeighbors(
      centerNodeModel,
      step,
      maxNeighborNumPerNode
    );
    // update the origin data
    originData.nodes = originData.nodes.concat(neighborSubGraph.nodes);
    originData.edges = originData.edges.concat(neighborSubGraph.edges);
    // update the origin nodeMap
    neighborSubGraph.nodes.forEach((node: { id: string | number }) => {
      nodeMap[node.id] = node;
    });
    // update the clusteredData
    const clusterId = centerNodeModel.clusterId;
    clusteredData.clusters.forEach(
      (cluster: { id: any; nodes: string | any[]; sumTot: any }) => {
        if (cluster.id !== clusterId) return;
        cluster.nodes = cluster.nodes.concat(neighborSubGraph.nodes);
        cluster.sumTot += neighborSubGraph.edges.length;
      }
    );
    // update the count
    aggregatedNodeMap[clusterId].count += neighborSubGraph.nodes.length;

    currentData.nodes = currentData.nodes.concat(neighborSubGraph.nodes);
    currentData.edges = currentData.edges.concat(neighborSubGraph.edges);
    return currentData;
  };

  const generateNeighbors = (
    centerNodeModel: { id: any; clusterId: any; level?: number; colorSet: any },
    step: number,
    maxNeighborNumPerNode = 5
  ) => {
    if (step <= 0) return undefined;
    let nodes: any[] = [],
      edges: any[] = [];
    const clusterId = centerNodeModel.clusterId;
    const centerId = centerNodeModel.id;
    const neighborNum = Math.ceil(Math.random() * maxNeighborNumPerNode);
    for (let i = 0; i < neighborNum; i++) {
      const neighborNode = {
        id: uniqueId(),
        clusterId,
        level: 0,
        colorSet: centerNodeModel.colorSet,
      };
      nodes.push(neighborNode);
      const dire = Math.random() > 0.5;
      const source = dire ? centerId : neighborNode.id;
      const target = dire ? neighborNode.id : centerId;
      const neighborEdge = {
        id: uniqueId(),
        source,
        target,
        label: `${source}-${target}`,
      };
      edges.push(neighborEdge);
      const subNeighbors = generateNeighbors(
        neighborNode,
        step - 1,
        maxNeighborNumPerNode
      );
      if (subNeighbors) {
        nodes = nodes.concat(subNeighbors.nodes);
        edges = edges.concat(subNeighbors.edges);
      }
    }
    return { nodes, edges };
  };

  const getExtractNodeMixedGraph = (
    extractNodeData: { id: any },
    originData: { edges: any[] },
    nodeMap: Record<string, NodeConfig & { clusterId: string }>,
    aggregatedNodeMap: Record<string, NodeConfig & { clusterId: string }>,
    currentUnproccessedData: GraphData
  ) => {
    const extractNodeId = extractNodeData.id;
    // const extractNodeClusterId = extractNodeData.clusterId;
    // push to the current rendering data
    currentUnproccessedData.nodes?.push(extractNodeData);
    // update the count of aggregatedNodeMap, when to revert?
    // aggregatedNodeMap[extractNodeClusterId].count --;

    // extract the related edges
    originData.edges.forEach(
      (edge: { source: string | number; target: string | number }) => {
        if (edge.source === extractNodeId) {
          const targetClusterId = nodeMap[edge.target].clusterId;
          if (!aggregatedNodeMap[targetClusterId].expanded) {
            // did not expand, create an virtual edge fromt he extract node to the cluster
            currentUnproccessedData.edges?.push({
              id: uniqueId(),
              source: extractNodeId,
              target: targetClusterId,
            });
          } else {
            // if the cluster is already expanded, push the origin edge
            currentUnproccessedData.edges?.push(edge);
          }
        } else if (edge.target === extractNodeId) {
          const sourceClusterId = nodeMap[edge.source].clusterId;
          if (!aggregatedNodeMap[sourceClusterId].expanded) {
            // did not expand, create an virtual edge fromt he extract node to the cluster
            currentUnproccessedData.edges?.push({
              id: uniqueId(),
              target: extractNodeId,
              source: sourceClusterId,
            });
          } else {
            // if the cluster is already expanded, push the origin edge
            currentUnproccessedData.edges?.push(edge);
          }
        }
      }
    );
    return currentUnproccessedData;
  };

  const examAncestors = (
    model: { parentId: any },
    expandedArray: any[],
    length: number,
    keepTags: boolean[]
  ) => {
    for (let i = 0; i < length; i++) {
      const expandedNode = expandedArray[i];
      if (!keepTags[i] && model.parentId === expandedNode.id) {
        keepTags[i] = true; // 需要被保留
        examAncestors(expandedNode, expandedArray, length, keepTags);
        break;
      }
    }
  };

  const manageExpandCollapseArray = (
    nodeNumber: number,
    model: NodeConfig | EdgeConfig | ComboConfig | TreeGraphData,
    collapseArray: any[],
    expandArray: any[],
    graph: Graph
  ) => {
    manipulatePosition = { x: model.x, y: model.y };

    // 维护 expandArray，若当前画布节点数高于上限，移出 expandedArray 中非 model 祖先的节点)
    if (nodeNumber > NODE_LIMIT) {
      // 若 keepTags[i] 为 true，则 expandedArray 的第 i 个节点需要被保留
      const keepTags = {};
      const expandLen = expandArray.length;
      // 检查 X 的所有祖先并标记 keepTags
      examAncestors(model, expandArray, expandLen, keepTags);
      // 寻找 expandedArray 中第一个 keepTags 不为 true 的点
      let shiftNodeIdx = -1;
      for (let i = 0; i < expandLen; i++) {
        if (!keepTags[i]) {
          shiftNodeIdx = i;
          break;
        }
      }
      // 如果有符合条件的节点，将其从 expandedArray 中移除
      if (shiftNodeIdx !== -1) {
        let foundNode = expandArray[shiftNodeIdx];
        if (foundNode.level === 2) {
          let foundLevel1 = false;
          // 找到 expandedArray 中 parentId = foundNode.id 且 level = 1 的第一个节点
          for (let i = 0; i < expandLen; i++) {
            const eNode = expandArray[i];
            if (eNode.parentId === foundNode.id && eNode.level === 1) {
              foundLevel1 = true;
              foundNode = eNode;
              expandArray.splice(i, 1);
              break;
            }
          }
          // 若未找到，则 foundNode 不变, 直接删去 foundNode
          if (!foundLevel1) expandArray.splice(shiftNodeIdx, 1);
        } else {
          // 直接删去 foundNode
          expandArray.splice(shiftNodeIdx, 1);
        }
        // const removedNode = expandedArray.splice(shiftNodeIdx, 1); // splice returns an array
        const idSplits = foundNode.id.split("-");
        let collapseNodeId;
        // 去掉最后一个后缀
        for (let i = 0; i < idSplits.length - 1; i++) {
          const str = idSplits[i];
          if (collapseNodeId) collapseNodeId = `${collapseNodeId}-${str}`;
          else collapseNodeId = str;
        }
        const collapseNode = {
          id: collapseNodeId,
          parentId: foundNode.id,
          level: foundNode.level - 1,
        };
        collapseArray.push(collapseNode);
      }
    }

    const currentNode = {
      id: model.id,
      level: model.level,
      parentId: model.parentId,
    };

    // 加入当前需要展开的节点
    expandArray.push(currentNode);

    graph.get("canvas").setCursor("default");
    return { expandArray, collapseArray };
  };

  const cacheNodePositions = (nodes: string | any[]) => {
    const positionMap: Record<
      string,
      {
        x: string;
        y: string;
        level: number;
      }
    > = {};
    const nodeLength = nodes.length;
    for (let i = 0; i < nodeLength; i++) {
      const node = nodes[i].getModel();
      positionMap[node.id] = {
        x: node.x,
        y: node.y,
        level: node.level,
      };
    }
    return positionMap;
  };
  const stopLayout = () => {
    layout.instance?.stop();
  };

  const bindListener = (graph: Graph) => {
    graph.on("keydown", (evt: { key: any }) => {
      const code = evt.key;
      if (!code) {
        return;
      }
      if (code.toLowerCase() === "shift") {
        shiftKeydown = true;
      } else {
        shiftKeydown = false;
      }
    });
    graph.on("keyup", (evt: { key: any }) => {
      const code = evt.key;
      if (!code) {
        return;
      }
      if (code.toLowerCase() === "shift") {
        shiftKeydown = false;
      }
    });
    graph.on("node:mouseenter", (evt) => {
      const { item } = evt;
      const model = item?.getModel();
      const currentLabel = model.label;
      model.oriFontSize = model.labelCfg.style.fontSize;
      item.update({
        label: model.oriLabel,
      });
      model.oriLabel = currentLabel;
      graph.setItemState(item, "hover", true);
      item.toFront();
    });

    graph.on("node:mouseleave", (evt) => {
      const { item } = evt;
      const model = item.getModel();
      const currentLabel = model.label;
      item.update({
        label: model.oriLabel,
      });
      model.oriLabel = currentLabel;
      graph.setItemState(item, "hover", false);
    });

    graph.on("edge:mouseenter", (evt) => {
      const { item } = evt;
      const model = item.getModel();
      const currentLabel = model.label;
      item.update({
        label: model.oriLabel,
      });
      model.oriLabel = currentLabel;
      item.toFront();
      item.getSource().toFront();
      item.getTarget().toFront();
    });

    graph.on("edge:mouseleave", (evt) => {
      const { item } = evt;
      const model = item.getModel();
      const currentLabel = model.label;
      item.update({
        label: model.oriLabel,
      });
      model.oriLabel = currentLabel;
    });
    // click node to show the detail drawer
    graph.on("node:click", (evt) => {
      stopLayout();
      if (!shiftKeydown) {
        clearFocusItemState(graph);
      } else {
        clearFocusEdgeState(graph);
      }
      const { item } = evt;
      if (item) {
        const nodeModel = item.getModel() as NodeConfig;
        // highlight the clicked node, it is down by click-select
        graph.setItemState(item, "focus", true);
        model.selectNode(nodeModel);
        if (!shiftKeydown) {
          // 将相关边也高亮
          const relatedEdges = (item as INode).getEdges();
          relatedEdges.forEach((edge: any) => {
            graph.setItemState(edge, "focus", true);
          });
        }
      }
    });

    // click edge to show the detail of integrated edge drawer
    graph.on("edge:click", (evt) => {
      stopLayout();
      if (!shiftKeydown) clearFocusItemState(graph);
      const { item } = evt;
      // highlight the clicked edge
      graph.setItemState(item as any, "focus", true);
    });

    // click canvas to cancel all the focus state
    graph.on("canvas:click", (evt) => {
      clearFocusItemState(graph);
      model.resetSelectNode();
    });
  };

  const searchNode = (id: string | number) => {
    if (!graph || graph.get("destroyed")) return false;
    const item = graph.findById(id as string);
    const originNodeData = nodeMap[id];
    if (!item && originNodeData) {
      // does not exit the current mixed graph but in the origin data
      cachePositions = cacheNodePositions(graph.getNodes());
      currentUnproccessedData = getExtractNodeMixedGraph(
        originNodeData,
        originData,
        nodeMap,
        aggregatedNodeMap,
        currentUnproccessedData
      );
      handleRefreshGraph(
        graph,
        currentUnproccessedData,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        largeGraphMode,
        true,
        false
      );
    }
    if (!item) return false;
    if (item && item.getType() !== "node") return false;
    graph.focusItem(item, true);
    clearFocusItemState(graph);
    graph.setItemState(item, "focus", true);
    return true;
  };

  useEffect(() => {
    if (container && container.current) {
      CANVAS_WIDTH = container.current.offsetWidth;
      CANVAS_HEIGHT = container.current.offsetHeight;
    }
    originData = data;
    nodeMap = {};
    const clusteredData = louvain(data as any, false, "weight");
    const aggregatedData: { nodes: NodeConfig[]; edges: EdgeConfig[] } = {
      nodes: [],
      edges: [],
    };
    console.log(colorSets);
    clusteredData.clusters.forEach((cluster, i) => {
      cluster.nodes.forEach((node) => {
        node.level = 0;
        node.label = node.id;
        node.type = "";
        node.colorSet = colorSets[i];
        nodeMap[node.id] = node;
      });
      const cnode = {
        id: cluster.id,
        type: "aggregated-node",
        count: cluster.nodes.length,
        level: 1,
        label: cluster.id,
        colorSet: colorSets[i],
        idx: i,
      };
      aggregatedNodeMap[cluster.id] = cnode;
      aggregatedData.nodes.push(cnode);
    });
    clusteredData.clusterEdges.forEach((clusterEdge) => {
      const cedge = {
        ...clusterEdge,
        size: Math.log(clusterEdge.count as number),
        label: "",
        id: `edge-${uniqueId()}`,
      };
      if (cedge.source === cedge.target) {
        cedge.type = "loop";
        cedge.loopCfg = {
          dist: 20,
        };
      } else cedge.type = "line";
      aggregatedData.edges.push(cedge);
    });

    data.edges?.forEach((edge) => {
      edge.label = `${edge.source}-${edge.target}`;
      edge.id = `edge-${uniqueId()}`;
    });

    currentUnproccessedData = aggregatedData;
    setClusterNodeData(aggregatedData);
    setDisplayClusterGroup(aggregatedData.nodes.map((node) => node.id));
    const { edges: processedEdges } = processNodesEdges(
      currentUnproccessedData.nodes ?? [],
      currentUnproccessedData.edges ?? [],
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      largeGraphMode,
      true,
      true
    );

    const contextMenu = new G6.Menu({
      shouldBegin(evt) {
        if (!evt) return false;
        if (evt.target && evt.target.isCanvas && evt.target.isCanvas())
          return true;
        if (evt.item) return true;
        return false;
      },
      getContent(evt): string {
        if (!evt) return "";
        const { item } = evt;
        if (evt.target && evt.target.isCanvas && evt.target.isCanvas()) {
          return `<ul>
                  <li id='show'>显示所有隐藏元素</li>
                  <li id='collapseAll'>聚合所有聚类</li>
                </ul>`;
        } else if (!item) {
          return "";
        }
        const itemType = item.getType();
        const model = item.getModel();
        if (itemType && model) {
          if (itemType === "node") {
            if (model.level !== 0) {
              return `<ul>
                      <li id='expand'>展开该聚合点</li>
                      <li id='hide'>隐藏该节点</li>
                    </ul>`;
            } else {
              return `<ul>
                      <li id='collapse'>聚合所属聚类</li>
                      <li id='neighbor-1'>扩展一度关系</li>
                      <li id='neighbor-2'>扩展二度关系</li>
                      <li id='neighbor-3'>扩展三度关系</li>
                      <li id='hide'>隐藏该节点</li>
                    </ul>`;
            }
          } else {
            return `<ul>
                    <li id='hide'>隐藏该边</li>
                  </ul>`;
          }
        }
        return "";
      },
      handleMenuClick: (target: { id: string }, item: Item) => {
        const model = item?.getModel();
        const liIdStrs = target.id.split("-");
        let mixedGraphData;
        switch (liIdStrs[0]) {
          case "hide":
            graph.hideItem(item);
            hiddenItemIds.push(model.id);
            break;
          case "expand":
            const newArray = manageExpandCollapseArray(
              graph.getNodes().length,
              model,
              collapseArray,
              expandArray,
              graph
            );
            expandArray = newArray.expandArray;
            collapseArray = newArray.collapseArray;
            mixedGraphData = getMixedGraph(
              clusteredData,
              data,
              nodeMap,
              aggregatedNodeMap,
              expandArray,
              collapseArray
            );
            break;
          case "collapse":
            const aggregatedNode = aggregatedNodeMap[model.clusterId];
            manipulatePosition = {
              x: aggregatedNode.x,
              y: aggregatedNode.y,
            };
            collapseArray.push(aggregatedNode);
            for (let i = 0; i < expandArray.length; i++) {
              if (expandArray[i].id === model.clusterId) {
                expandArray.splice(i, 1);
                break;
              }
            }
            mixedGraphData = getMixedGraph(
              clusteredData,
              data,
              nodeMap,
              aggregatedNodeMap,
              expandArray,
              collapseArray
            );
            break;
          case "collapseAll":
            expandArray = [];
            collapseArray = [];
            mixedGraphData = getMixedGraph(
              clusteredData,
              data,
              nodeMap,
              aggregatedNodeMap,
              expandArray,
              collapseArray
            );
            break;
          case "neighbor":
            const expandNeighborSteps = parseInt(liIdStrs[1]);
            mixedGraphData = getNeighborMixedGraph(
              model,
              expandNeighborSteps,
              data,
              clusteredData,
              currentUnproccessedData,
              nodeMap,
              aggregatedNodeMap,
              10
            );
            break;
          case "show":
            showItems(graph);
            setDisplayClusterGroup(aggregatedData.nodes.map((node) => node.id));
            break;
          default:
            break;
        }
        if (mixedGraphData) {
          cachePositions = cacheNodePositions(graph.getNodes());
          currentUnproccessedData = mixedGraphData;
          handleRefreshGraph(
            graph,
            currentUnproccessedData,
            CANVAS_WIDTH,
            CANVAS_HEIGHT,
            largeGraphMode,
            true,
            false
          );
        }
      },
      // offsetX and offsetY include the padding of the parent container
      // 需要加上父级容器的 padding-left 16 与自身偏移量 10
      offsetX: 16 + 10,
      // 需要加上父级容器的 padding-top 24 、画布兄弟元素高度、与自身偏移量 10
      offsetY: 0,
      // the types of items that allow the menu show up
      // 在哪些类型的元素上响应
      itemTypes: ["node", "edge", "canvas"],
    });
    if (!graph) {
      graph = new G6.Graph({
        container: container.current as HTMLElement,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        linkCenter: true,
        minZoom: 0.1,
        groupByTypes: false,
        modes: {
          default: [
            {
              type: "drag-canvas",
              enableOptimize: true,
            },
            {
              type: "zoom-canvas",
              enableOptimize: true,
              optimizeZoom: 0.01,
            },
            "drag-node",
            "shortcuts-call",
          ],
          lassoSelect: [
            {
              type: "zoom-canvas",
              enableOptimize: true,
            },
            {
              type: "lasso-select",
              selectedState: "focus",
              trigger: "drag",
            },
          ],
        },
        defaultNode: {
          type: "aggregated-node",
          size: DEFAULTNODESIZE,
        },
        plugins: [contextMenu],
      });
      graphRef.current = graph;
    }

    graph?.get("canvas").set("localRefresh", false);

    const layoutConfig: any = getForceLayoutConfig(graph, largeGraphMode);
    layoutConfig.center = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];
    layout.instance = new G6.Layout["gForce"](layoutConfig);
    layout.instance?.init({
      nodes: currentUnproccessedData.nodes,
      edges: processedEdges,
    });
    layout.instance?.execute();

    bindListener(graph);
    graph.data({ nodes: aggregatedData.nodes, edges: processedEdges });
    graph.render();
  }, []);

  useMutationObserver(container, () => {
    if (container && container.current) {
      CANVAS_WIDTH = container.current.offsetWidth;
      CANVAS_HEIGHT = container.current.offsetHeight;
    }
    if (graphRef.current && layout.instance) {
      layout.instance.center = [CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2];
      graphRef.current.changeSize(CANVAS_WIDTH, CANVAS_HEIGHT);
      layout.instance?.execute();
      graph.render();
    }
  });

  useEffect(() => {
    if (graphRef.current && clusterNodeData) {
      showItems(graphRef.current);
      //选取其他clusterId进行隐藏操作
      clusterNodeData.nodes
        ?.filter((node) => !displayClusterGroup.includes(node.id))
        .map((node) => {
          const item = graphRef.current!.findById(node.id);
          graphRef.current!.hideItem(item);
        });
    }
  }, [displayClusterGroup, clusterNodeData]);


  return (
    <>
      <AllContainer>
        <GraphContainer ref={container}></GraphContainer>


        <LegendGroup size={2}>
          {(clusterNodeData?.nodes ?? []).map((cluster, idx) => {
            return (
              <Checkbox
                key={cluster.id}
                checked={displayClusterGroup.includes(cluster.id)}
                onChange={() => {
                  setDisplayClusterGroup((idGroup) => {
                    if (idGroup.includes(cluster.id)) {
                      return [...idGroup.filter((id) => id !== cluster.id)];
                    } else {
                      return [...idGroup, cluster.id];
                    }
                  });
                }}
              >
                <Legend
                  style={{
                    background: (cluster.colorSet as any).mainFill,
                  }}
                >
                  {`聚类${idx}`}
                </Legend>
              </Checkbox>
            );
          })}
        </LegendGroup>
      </AllContainer>
    </>
  );
});

export { CustomGraph };

const AllContainer = styled.div`
 
  height:63vh;
  overflow:hidden;
  
  
  

`

const GraphContainer = styled.div`
  height: 60vh;
  width: 100%;
`;

const Legend = styled.span`
  color: #fff;
  height: 20px;
  border-radius: 8px;
  min-width: 50px;
  padding: 4px 10px;
`;
const LegendGroup = styled(Space)`
 
 margin-left:20px;
  
`;
