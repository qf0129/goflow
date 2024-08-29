import "./X6View.less";
import React from "react";
import { Edge, Graph } from "@antv/x6";
import { DagreLayout } from "@antv/layout";
import { nanoid } from "nanoid";
import { Space } from "tdesign-react";
import { register } from "@antv/x6-react-shape";
import { NodeType } from "../../utils/consts";
import DraggableNode from "./nodes/DraggableNode";
import CustomNode from "./nodes/CustomNode";
import PropPanel from "./prop/PropPanel";
import EmptyNode from "./nodes/EmptyNode";
import TextNode from "./nodes/TextNode";
import DndPanel from "./dnd/DndPanel";

const startNodeId = "start";
const endNodeId = "end";
const defaultNodeSize = { width: 200, height: 50 };
const initData = {
  nodes: [
    { id: startNodeId, shape: "start", size: { width: 200, height: 30 } },
    { id: endNodeId, shape: "end", size: { width: 200, height: 30 } },
    { id: "empty", shape: "empty", size: defaultNodeSize },
    // { id: "3", label: "node3", shape: "custom", nodeType: "job", size: { width: 200, height: 50 } },
    // { id: "4", label: "node4", shape: "custom", nodeType: "job", size: { width: 200, height: 50 } },
  ],
  edges: [
    { id: nanoid(), source: startNodeId, target: "empty" },
    { id: nanoid(), source: "empty", target: endNodeId },
    // { id: nanoid(), source: "1", target: "3" },
    // { id: nanoid(), source: "3", target: "4" },
  ],
};

register({ shape: "custom", component: CustomNode });
register({ shape: "empty", component: EmptyNode });
register({ shape: "start", component: TextNode, label: "开始" });
register({ shape: "end", component: TextNode, label: "结束" });

export default class X6View extends React.Component {
  private container: HTMLDivElement;
  private graph: Graph;
  private data: any = initData;
  private layout = new DagreLayout({
    type: "dagre",
    rankdir: "TB",
    align: "UL",
    ranksep: 30,
    nodesep: 15,
    controlPoints: true,
  });

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  componentDidMount() {
    this.graph = new Graph({
      panning: true,
      interacting: { nodeMovable: false, edgeMovable: false },
      mousewheel: { enabled: true, modifiers: ["ctrl", "meta"] },
      scaling: { min: 0.3, max: 2 },
      container: this.container,
      background: { color: "#F2F7FA" },
    });

    this.graph.fromJSON(this.layout.layout(this.data));
    this.graph.centerContent();
  }

  onMouseUp = (edge: Edge, nodeType: string) => {
    const nodeId = nanoid();
    if (nodeType == NodeType.Choice) {
      const branchId = nanoid();
      this.data.nodes.push({ id: nodeId, shape: "custom", nodeType: nodeType, size: defaultNodeSize });
      this.data.nodes.push({ id: branchId, shape: "empty", size: defaultNodeSize });
      // this.data.edges.push({ id: nanoid(), source: edge.source, target: nodeId });
      this.data.edges.push({ id: nanoid(), source: nodeId, target: edge.target, labels: [{ attrs: { label: { text: "默认分支" } } }] });
      this.data.edges.push({ id: nanoid(), source: nodeId, target: branchId, labels: [{ attrs: { label: { text: "选择1" } } }] });
      this.data.edges.push({ id: nanoid(), source: branchId, target: endNodeId });
    } else {
      this.data.nodes.push({ id: nodeId, shape: "custom", nodeType: nodeType, size: defaultNodeSize });
      this.data.edges.push({ id: nanoid(), source: nodeId, target: edge.target });
    }
    this.data.edges.forEach((e: any) => {
      if (e.id == edge.id) e.target = nodeId;
    });

    console.log("data >>", this.data);
    const newData = this.layout.layout(this.data);
    console.log("new >>", newData);
    this.graph.fromJSON(newData);
  };

  render() {
    return (
      <div className="x6-root">
        <div className="x6-container" ref={this.refContainer} />
        <DndPanel graph={this.graph} onMouseUp={this.onMouseUp} />
        <PropPanel />
      </div>
    );
  }
}
