import G6, { Graph } from "@antv/g6";
const { uniqueId } = G6.Util;
export const descendCompare = (p: string) => {
  // 这是比较函数
  return function (m: { [x: string]: any }, n: { [x: string]: any }) {
    const a = m[p];
    const b = n[p];
    return b - a; // 降序
  };
};

export const clearFocusItemState = (graph: any) => {
  if (!graph) return;
  clearFocusNodeState(graph);
  clearFocusEdgeState(graph);
};

// 清除图上所有节点的 focus 状态及相应样式
export const clearFocusNodeState = (graph: Graph) => {
  const focusNodes = graph.findAllByState("node", "focus");
  focusNodes.forEach((fnode: any) => {
    graph.setItemState(fnode, "focus", false); // false
  });
};

// 清除图上所有边的 focus 状态及相应样式
export const clearFocusEdgeState = (graph: Graph) => {
  const focusEdges = graph.findAllByState("edge", "focus");
  focusEdges.forEach((fedge: any) => {
    graph.setItemState(fedge, "focus", false);
  });
};

// 截断长文本。length 为文本截断后长度，elipsis 是后缀
export const formatText = (text: string, length = 5, elipsis = "...") => {
  if (!text) return "";
  if (text.length > length) {
    return `${text.substr(0, length)}${elipsis}`;
  }
  return text;
};

export const labelFormatter = (
  text: {
    split: (arg0: string) => { (): any; new (): any; length: number };
    substr: (arg0: number, arg1: number) => any;
  },
  minLength = 10
) => {
  if (text && text.split("").length > minLength)
    return `${text.substr(0, minLength)}...`;
  return text;
};
