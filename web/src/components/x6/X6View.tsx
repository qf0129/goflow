import "./X6View.less";
import React from "react";
import { Edge, Graph } from "@antv/x6";
import { DagreLayout } from "@antv/layout";
import { nanoid } from "nanoid";
import { Space } from "tdesign-react";
import { register } from "@antv/x6-react-shape";
import DraggableNode from "./DraggableNode";
import CustomNode from "./CustomNode";
import PropPanel from "./PropPanel";
import { NodeType } from "../../utils/consts";
import EmptyNode from "./EmptyNode";

const initData = {
  nodes: [
    { id: "1", label: "node1", shape: "custom", nodeType: "job", size: { width: 200, height: 50 } },
    { id: "2", label: "node2", shape: "custom", nodeType: "job", size: { width: 200, height: 50 } },
    // { id: "3", label: "node3", shape: "custom", nodeType: "job", size: { width: 200, height: 50 } },
    // { id: "4", label: "node4", shape: "custom", nodeType: "job", size: { width: 200, height: 50 } },
  ],
  edges: [
    { id: nanoid(), source: "1", target: "2" },
    // { id: nanoid(), source: "1", target: "3" },
    // { id: nanoid(), source: "3", target: "4" },
  ],
};

const defaultNodeSize = { width: 200, height: 50 };

register({ shape: "custom", component: CustomNode });
register({ shape: "empty", component: EmptyNode });

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
      container: this.container,
      background: { color: "#F2F7FA" },
    });

    const newModel = this.layout.layout(this.data);
    this.graph.fromJSON(newModel);
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
    } else {
      this.data.nodes.push({ id: nodeId, shape: "custom", nodeType: nodeType, size: defaultNodeSize });
      this.data.edges.push({ id: nanoid(), source: nodeId, target: edge.target });
    }
    this.data.edges.forEach((e: any) => {
      if (e.id == edge.id) e.target = nodeId;
    });

    this.graph.fromJSON(this.layout.layout(this.data));
  };

  render() {
    return (
      <div className="x6-root">
        <div className="x6-container" ref={this.refContainer} />
        <div className="x6-panel dnd-panel">
          <h3 style={{ lineHeight: "50px" }}>节点列表</h3>
          <Space direction="vertical" size={10}>
            <DraggableNode nodeType="job" graph={this.graph} onMouseUp={this.onMouseUp} />
            <DraggableNode nodeType="wait" graph={this.graph} onMouseUp={this.onMouseUp} />
            <DraggableNode nodeType="choice" graph={this.graph} onMouseUp={this.onMouseUp} />
          </Space>
        </div>
        <PropPanel />
      </div>
    );
  }
}
