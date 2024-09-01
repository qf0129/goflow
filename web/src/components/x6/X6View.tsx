import "./X6View.less";
import React from "react";
import { Cell, Edge, Graph, Node } from "@antv/x6";
import { DagreLayout } from "@antv/layout";
import { nanoid } from "nanoid";
import { register } from "@antv/x6-react-shape";
import { NodeType } from "../../utils/consts";
import CustomNode from "./nodes/CustomNode";
import PropPanel from "./prop/PropPanel";
import EmptyNode from "./nodes/EmptyNode";
import TextNode from "./nodes/TextNode";
import DndPanel from "./dnd/DndPanel";
import { TestNode } from "./nodes/TestNode";

const startNodeId = "start";
const endNodeId = "end";
const defaultNodeSize = { width: 200, height: 50 };
const defaultEdgeStyle = { router: { name: "manhattan" }, connector: { name: "rounded" } };
const firstEmptyNodeId = nanoid();
const initData = {
  nodes: [
    { id: startNodeId, shape: "start", size: { width: 200, height: 30 } },
    { id: endNodeId, shape: "end", size: { width: 200, height: 30 } },
    { id: firstEmptyNodeId, shape: "test", size: defaultNodeSize },
  ],
  edges: [
    { id: nanoid(), source: startNodeId, target: firstEmptyNodeId },
    { id: nanoid(), source: firstEmptyNodeId, target: endNodeId },
  ],
};

Graph.registerNode("test", TestNode);
register({ shape: "custom", component: CustomNode });
register({ shape: "empty", component: EmptyNode });
register({ shape: "start", component: TextNode, label: "开始" });
register({ shape: "end", component: TextNode, label: "结束" });

export default class X6View extends React.Component {
  private container: HTMLDivElement | undefined = undefined;
  private graph: Graph;
  private data: any = initData;
  // selectedNode: Node | undefined = undefined;
  private layout = new DagreLayout({
    type: "dagre",
    rankdir: "TB",
    ranksep: 30,
    nodesep: 15,
  });

  state: { selectedNode: Node | undefined } = {
    selectedNode: undefined,
  };

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

    this.graph.on("node:click", ({ node }) => {
      // if (this.state.selectedNode) {
      //   if (this.state.selectedNode.id == node.id) {
      //     return;
      //   } else {
      //     this.state.selectedNode.setData({ selected: false });
      //   }
      // }
      console.log("clickNode >", node);
      node.setData({ selected: true });
      node.attr("body/stroke", "#00f");
      this.setState({ selectedNode: node });
    });

    this.graph.on("blank:click", ({}) => {
      if (this.state.selectedNode) {
        this.state.selectedNode.setData({ selected: false });
        this.state.selectedNode.attr("body/stroke", "#000");
      }
      this.setState({ selectedNode: undefined });
      console.log("clickBlank >", this.state.selectedNode);
    });

    // this.graph.fromJSON(this.layout.layout(this.data));
    this.graph.fromJSON(this.data);
    this.graph.centerContent();
  }

  addNodeOnEdge = (edge: Edge, nodeType: string) => {
    const nodeId = nanoid();
    if (nodeType == NodeType.Choice) {
      const branchId = nanoid();
      this.data.nodes.push({ id: nodeId, shape: "custom", nodeType: nodeType, size: defaultNodeSize });
      this.data.nodes.push({ id: branchId, shape: "empty", size: defaultNodeSize });
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
  };

  addNodeOnEmptyNode = (emptyNode: Node<Node.Properties>, nodeType: string) => {
    const toEdge = this.graph.getConnectedEdges(emptyNode).find((e: Edge) => e.getSourceCellId() == emptyNode.id);
    const fromEdge = this.graph.getConnectedEdges(emptyNode).find((e: Edge) => e.getTargetCellId() == emptyNode.id);
    if (!toEdge || !fromEdge) return;

    const nodeId = nanoid();
    if (nodeType == NodeType.Choice) {
      const branchId = nanoid();
      this.data.nodes.push({ id: nodeId, shape: "custom", nodeType: nodeType, size: defaultNodeSize });
      this.data.nodes.push({ id: branchId, shape: "empty", size: defaultNodeSize });
      this.data.edges.push({ id: nanoid(), source: fromEdge.source, target: nodeId });
      this.data.edges.push({ id: nanoid(), source: nodeId, target: toEdge.target, labels: [{ attrs: { label: { text: "默认分支" } } }] });
      this.data.edges.push({ id: nanoid(), source: nodeId, target: branchId, labels: [{ attrs: { label: { text: "选择1" } } }] });
      this.data.edges.push({ id: nanoid(), source: branchId, target: endNodeId });
    } else {
      this.data.nodes.push({ id: nodeId, shape: "custom", nodeType: nodeType, size: defaultNodeSize });
      this.data.edges.push({ id: nanoid(), source: fromEdge.source, target: nodeId });
      this.data.edges.push({ id: nanoid(), source: nodeId, target: toEdge.target });
    }

    this.data.nodes = this.data.nodes.filter((n: Node) => n.id !== emptyNode.id);
    this.data.edges = this.data.edges.filter((n: Node) => n.id !== toEdge.id && n.id !== fromEdge.id);
  };

  onMouseUp = (cell: Cell, nodeType: string) => {
    if (cell.isEdge()) {
      const edge = cell as Edge;
      this.addNodeOnEdge(edge, nodeType);
    } else {
      const node = cell as Node;
      this.addNodeOnEmptyNode(node, nodeType);
    }
    const newData = this.layout.layout(this.data);
    this.graph.fromJSON(newData);
  };

  render() {
    return (
      <div className="x6-root">
        <div className="x6-container" ref={this.refContainer} />
        <DndPanel graph={this.graph} onMouseUp={this.onMouseUp} />
        <PropPanel node={this.state.selectedNode} />
      </div>
    );
  }
}
