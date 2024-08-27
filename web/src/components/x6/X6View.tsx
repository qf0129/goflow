import React from "react";
import { Graph } from "@antv/x6";
import "./X6View.less";
import { DagreLayout } from "@antv/layout";
import { Dnd } from "@antv/x6-plugin-dnd";

const data = {
  nodes: [
    {
      id: "1",
      label: "node1",
      size: {
        width: 200,
        height: 40,
      },
    },
    {
      id: "2",
      label: "node2",
      size: {
        width: 200,
        height: 40,
      },
    },
    {
      id: "3",
      label: "node3",
      size: {
        width: 200,
        height: 40,
      },
    },
    {
      id: "4",
      label: "node4",
      size: {
        width: 200,
        height: 40,
      },
    },
  ],
  edges: [
    {
      source: "1",
      target: "2",
    },
    {
      source: "1",
      target: "3",
    },
    {
      source: "3",
      target: "4",
    },
  ],
};

export default class TestPage extends React.Component {
  private container: HTMLDivElement;
  private dndContainer: HTMLDivElement;
  private graph: Graph;
  private dnd: Dnd;

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      background: {
        color: "#F2F7FA",
      },
    });

    this.dnd = new Dnd({
      target: this.graph,
    });

    const dagreLayout = new DagreLayout({
      type: "dagre",
      rankdir: "TB",
      align: "UL",
      ranksep: 30,
      nodesep: 15,
      controlPoints: true,
    });

    this.graph.on("node:moving", ({ e, x, y, node, view }) => {
      console.log(e, x, y, node, view);
    });

    const newModel = dagreLayout.layout(data);
    this.graph.fromJSON(newModel);
    this.graph.centerContent();
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };
  dndContainerRef = (container: HTMLDivElement) => {
    this.dndContainer = container;
  };

  startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const node = this.graph.createNode({
      width: 140,
      height: 40,
      label: "Node",
    });
    this.dnd.start(node, e.nativeEvent);
  };

  render() {
    return (
      <div className="x6root">
        <div className="dnd-list" ref={this.dndContainerRef}>
          <div className="dnd-item" onMouseDown={this.startDrag}>
            Job
          </div>
          <div className="dnd-item" onMouseDown={this.startDrag}>
            Wait
          </div>
          <div className="dnd-item" onMouseDown={this.startDrag}>
            Choice
          </div>
        </div>
        <div className="x6container" ref={this.refContainer} />
      </div>
    );
  }
}
