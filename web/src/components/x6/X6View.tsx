import "./X6View.less";
import React from "react";
import { Edge, Graph } from "@antv/x6";
import { DagreLayout } from "@antv/layout";
import { nanoid } from "nanoid";
import { Space } from "tdesign-react";
import { register } from "@antv/x6-react-shape";
import DraggableNode from "./DraggableNode";
import CustomNode from "./CustomNode";

const data = {
  nodes: [
    { id: "1", label: "node1", shape: "custom", nodeType: "job", size: { width: 200, height: 50 } },
    { id: "2", label: "node2", shape: "custom", nodeType: "job", size: { width: 200, height: 50 } },
    { id: "3", label: "node3", shape: "custom", nodeType: "job", size: { width: 200, height: 50 } },
    { id: "4", label: "node4", shape: "custom", nodeType: "job", size: { width: 200, height: 50 } },
  ],
  edges: [
    { id: nanoid(), source: "1", target: "2" },
    { id: nanoid(), source: "1", target: "3" },
    { id: nanoid(), source: "3", target: "4" },
  ],
};

register({
  shape: "custom",
  component: CustomNode,
});

export default class X6View extends React.Component {
  private container: HTMLDivElement;
  private graph: Graph;
  private data: any = data;
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
      container: this.container,
      background: { color: "#F2F7FA" },
    });

    const newModel = this.layout.layout(this.data);
    this.graph.fromJSON(newModel);
    this.graph.centerContent();
  }

  onMouseUp = (edge: Edge, nodeType: string) => {
    const nodeId = nanoid();

    this.data.nodes.push({
      id: nodeId,
      shape: "custom",
      nodeType: nodeType,
      size: {
        width: 200,
        height: 50,
      },
      label: "新节点",
    });

    this.data.edges.push({ id: nanoid(), source: edge.source, target: nodeId });
    this.data.edges.push({ id: nanoid(), source: nodeId, target: edge.target });
    this.data.edges = this.data.edges.filter((e: Edge) => e.id !== edge.id);
    const newModel = this.layout.layout(this.data);
    this.graph.fromJSON(newModel);
  };

  render() {
    return (
      <div className="x6root">
        <div className="dnd-list">
          <Space direction="vertical">
            <DraggableNode nodeType="job" graph={this.graph} onMouseUp={this.onMouseUp} />
            <DraggableNode nodeType="wait" graph={this.graph} onMouseUp={this.onMouseUp} />
            <DraggableNode nodeType="choice" graph={this.graph} onMouseUp={this.onMouseUp} />
          </Space>
        </div>
        <div className="x6container" ref={this.refContainer} />
      </div>
    );
  }
}
