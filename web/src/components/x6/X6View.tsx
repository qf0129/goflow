import "./X6View.less";
import React from "react";
import { Edge, Graph } from "@antv/x6";
import { DagreLayout } from "@antv/layout";
import { Dnd } from "@antv/x6-plugin-dnd";
import DraggableNode from "./DraggableNode";
import { nanoid } from "nanoid";
import { Space } from "tdesign-react";

const data = {
  nodes: [
    { id: "1", label: "node1", size: { width: 140, height: 40 } },
    { id: "2", label: "node2", size: { width: 140, height: 40 } },
    { id: "3", label: "node3", size: { width: 140, height: 40 } },
    { id: "4", label: "node4", size: { width: 140, height: 40 } },
  ],
  edges: [
    { id: nanoid(), source: "1", target: "2" },
    { id: nanoid(), source: "1", target: "3" },
    { id: nanoid(), source: "3", target: "4" },
  ],
};

export default class X6View extends React.Component {
  private container: HTMLDivElement;
  private dndContainer: HTMLDivElement;
  private graph: Graph;
  private dnd: Dnd;
  private data: any = data;
  private layout = new DagreLayout({
    type: "dagre",
    rankdir: "TB",
    align: "UL",
    ranksep: 30,
    nodesep: 15,
    controlPoints: true,
  });

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.graph = new Graph({
      panning: true,
      container: this.container,
      background: {
        color: "#F2F7FA",
      },
    });

    this.dnd = new Dnd({
      target: this.graph,
    });

    const newModel = this.layout.layout(this.data);
    this.graph.fromJSON(newModel);
    this.graph.centerContent();
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };
  dndContainerRef = (container: HTMLDivElement) => {
    this.dndContainer = container;
  };

  onNodeDraging = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(event);
  };

  onMouseUp = (edge: Edge) => {
    const nodeId = nanoid();

    this.data.nodes.push({
      id: nodeId,
      shape: "rect",
      size: {
        width: 140,
        height: 40,
      },
      label: "newNode",
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
        <div className="dnd-list" ref={this.dndContainerRef}>
          <Space direction="vertical">
            <DraggableNode graph={this.graph} onMouseUp={this.onMouseUp}>
              Job
            </DraggableNode>
            <DraggableNode graph={this.graph} onMouseUp={this.onMouseUp}>
              Wait
            </DraggableNode>
            <DraggableNode graph={this.graph} onMouseUp={this.onMouseUp}>
              Choice
            </DraggableNode>
          </Space>
        </div>
        <div className="x6container" ref={this.refContainer} />
      </div>
    );
  }
}
