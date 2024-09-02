import "../../components/x6/X6View.less";
import React from "react";
import { Cell, Edge, Graph, Node } from "@antv/x6";
import { nanoid } from "nanoid";

const defaultNodeSize = { width: 200, height: 50 };

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

    const id1 = nanoid();
    const id2 = nanoid();
    const initData = {
      nodes: [
        { id: id1, label: "node1", size: defaultNodeSize },
        { id: id2, label: "node2", size: defaultNodeSize },
      ],
      edges: [{ source: id1, target: id2 }],
    };

    // this.graph.addNode({ id: nanoid(), label: "node1", size: defaultNodeSize });
    this.graph.fromJSON(initData);
  }

  render() {
    return (
      <div className="x6-root">
        <div className="x6-container" ref={this.refContainer} />
      </div>
    );
  }
}
