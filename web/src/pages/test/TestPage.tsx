import "../../components/x6/X6View.less";
import React from "react";
import { Cell, Edge, Graph, Node } from "@antv/x6";
import { nanoid } from "nanoid";

const startNodeId = "start";
const endNodeId = "end";
const defaultNodeSize = { width: 200, height: 50 };
const initData = {
  nodes: [
    { id: nanoid(), label: "node1", size: defaultNodeSize },
    { id: nanoid(), label: "node2", size: defaultNodeSize },
  ],
  edges: [{ id: nanoid(), source: startNodeId, target: endNodeId }],
};

export default class TestPage extends React.Component {
  private container: HTMLDivElement | undefined = undefined;
  private graph: Graph;

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      // interacting: { nodeMovable: false, edgeMovable: false },
      mousewheel: { enabled: true, modifiers: ["ctrl", "meta"] },
      scaling: { min: 0.3, max: 2 },
      background: { color: "#F2F7FA" },
      panning: true,
    });

    this.graph.addNode({ id: nanoid(), label: "node1", size: defaultNodeSize });
    // this.graph.addNode({ id: nanoid(), label: "node2", size: defaultNodeSize });

    initData.nodes.forEach((n) => {
      this.graph.addNode(n);
    });
    // initData.edges.forEach((e) => {
    //   this.graph.addEdge(e);
    // });
    // this.graph.fromJSON(initData);
    // this.graph.centerContent();
  }

  render() {
    return (
      <div className="x6-root">
        <div className="x6-container" ref={this.refContainer} />
      </div>
    );
  }
}
