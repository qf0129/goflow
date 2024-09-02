import "./X6View.less";
import React from "react";
import { Cell, Edge, Graph, Node, Size } from "@antv/x6";
import { nanoid } from "nanoid";
import { NodeType, NodeTypeTitle } from "../../utils/consts";
import PropPanel from "./prop/PropPanel";
import DndPanel from "./dnd/DndPanel";
import { CustomNode } from "./nodes/CustomNode";
import { EmptyNode, EndNode, StartNode } from "./nodes/CommonNodes";
import { LayoutNodes } from "./layout";
import { NodeConfig } from "../../utils/types";

Graph.registerNode("start", StartNode);
Graph.registerNode("end", EndNode);
Graph.registerNode("custom", CustomNode);
Graph.registerNode("empty", EmptyNode);

interface X6ViewState {
  selectedNode: Node | undefined;
  nodeConfigs: Record<string, NodeConfig>;
}

export default class X6View extends React.Component {
  private container: HTMLDivElement | undefined = undefined;
  private graph: Graph;
  private nodes: Cell.Metadata[] = [];
  private edges: Cell.Metadata[] = [];
  private endNodeId: string = "";

  state: X6ViewState = {
    selectedNode: undefined,
    nodeConfigs: {},
  };

  constructor(props: any) {
    super(props);
    const startNodeId = nanoid();
    const endNodeId = nanoid();
    const firstEmptyNodeId = nanoid();
    this.endNodeId = endNodeId;
    this.addNode(startNodeId, "start");
    this.addNode(endNodeId, "end");
    this.addNode(firstEmptyNodeId, "empty");
    this.addEdge(startNodeId, firstEmptyNodeId);
    this.addEdge(firstEmptyNodeId, endNodeId);
  }

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      interacting: { nodeMovable: false, edgeMovable: false },
      mousewheel: { enabled: true, modifiers: ["ctrl", "meta"] },
      scaling: { min: 0.3, max: 2 },
      background: { color: "#F2F7FA" },
      panning: true,
    });

    this.graph.on("node:click", ({ node }) => {
      this.selectNode(node);
    });

    this.graph.on("blank:click", ({}) => {
      this.unSelectNode();
    });

    this.refresh();
  }

  componentDidUpdate(prevProps, prevState: X6ViewState) {
    if (this.state.selectedNode !== prevState.selectedNode && !this.state.selectedNode) {
      this.refresh();
    }
  }

  refresh() {
    this.graph.fromJSON({ nodes: LayoutNodes(this.nodes, this.edges), edges: this.edges });
    this.graph.centerContent();
    this.graph.getNodes().forEach((n: Node) => {
      if (n.id && n.shape == "custom") {
        const config = this.state.nodeConfigs[n.id];
        if (config && config.Type) {
          if (n.data?.type) n.attr("typeTitle/text", NodeTypeTitle[config.Type]);
          if (n.data?.title) n.attr("nodeTitle/text", config.Name);
        }
      }
    });
  }
  addEdge(source: any, target: any, label?: string) {
    this.edges.push({
      id: nanoid(),
      source: source,
      target: target,
      router: { name: "manhattan" },
      connector: { name: "rounded" },
      labels: [{ attrs: { label: { text: label || "" } } }],
    });
  }

  addNode(id: string, shape: string, nodeType?: string) {
    this.nodes.push({
      id: id,
      shape: shape,
      size: shape == "start" || shape == "end" ? { width: 200, height: 30 } : { width: 200, height: 50 },
      data: {
        type: nodeType || "",
        title: nodeType ? NodeTypeTitle[nodeType] + "节点" : "",
      },
    });
    if (nodeType) {
      this.state.nodeConfigs[id] = {
        Id: id,
        Type: nodeType,
        Name: NodeTypeTitle[nodeType] + "节点",
      };
    }
  }

  addNodeOnEdge = (edge: Edge, nodeType: string) => {
    const nodeId = nanoid();
    if (nodeType == NodeType.Choice) {
      const branchId = nanoid();
      this.addNode(nodeId, "custom", nodeType);
      this.addNode(branchId, "empty");
      this.addEdge(nodeId, edge.getTargetCellId(), "默认分支");
      this.addEdge(nodeId, branchId, "选择1");
      this.addEdge(branchId, this.endNodeId);
    } else {
      this.addNode(nodeId, "custom", nodeType);
      this.addEdge(nodeId, edge.getTargetCellId());
    }
    this.edges.forEach((e: any) => {
      if (e.id == edge.id) e.target = nodeId;
    });
    return nodeId;
  };

  addNodeOnEmptyNode = (emptyNode: Node<Node.Properties>, nodeType: string) => {
    const toEdge = this.graph.getConnectedEdges(emptyNode).find((e: Edge) => e.getSourceCellId() == emptyNode.id);
    const fromEdge = this.graph.getConnectedEdges(emptyNode).find((e: Edge) => e.getTargetCellId() == emptyNode.id);
    if (!toEdge || !fromEdge) return;

    const nodeId = nanoid();
    if (nodeType == NodeType.Choice) {
      const branchId = nanoid();
      this.addNode(nodeId, "custom", nodeType);
      this.addNode(branchId, "empty");

      this.addEdge(fromEdge.getSourceCellId(), nodeId);
      this.addEdge(nodeId, toEdge.getTargetCellId(), "默认分支");
      this.addEdge(nodeId, branchId, "选择1");
      this.addEdge(branchId, this.endNodeId);
    } else {
      this.addNode(nodeId, "custom", nodeType);
      this.addEdge(fromEdge.getSourceCellId(), nodeId);
      this.addEdge(nodeId, toEdge.getTargetCellId());
    }

    this.nodes = this.nodes.filter((c: Cell.Metadata) => c.id !== emptyNode.id);
    this.edges = this.edges.filter((c: Cell.Metadata) => c.id !== toEdge.id && c.id !== fromEdge.id);
    return nodeId;
  };

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  selectNode(node: Node | undefined) {
    if (!node || node.shape !== "custom") return;
    if (this.state.selectedNode) {
      if (this.state.selectedNode.id == node.id) {
        return;
      } else {
        this.state.selectedNode.attr("body/stroke", "#000");
        this.state.selectedNode.attr("body/strokeWidth", 1);
      }
    }
    node.attr("body/stroke", "#22e");
    node.attr("body/strokeWidth", 2);
    this.setState({ selectedNode: node });
  }

  unSelectNode() {
    if (this.state.selectedNode) {
      this.state.selectedNode.attr("body/stroke", "#000");
      this.state.selectedNode.attr("body/strokeWidth", 1);
    }
    this.setState({ selectedNode: undefined });
  }

  onMouseUp = (cell: Cell, nodeType: string) => {
    let newNodeId = "";
    if (cell.isEdge()) {
      const edge = cell as Edge;
      newNodeId = this.addNodeOnEdge(edge, nodeType);
    } else {
      const node = cell as Node;
      newNodeId = this.addNodeOnEmptyNode(node, nodeType) || "";
    }
    this.refresh();
    const newNode = this.graph.getNodes().find((n) => n.id == newNodeId);
    this.selectNode(newNode);
  };

  ExportJson() {
    console.log(this.nodes);
  }

  HandleUpdateNode = (newConfig: NodeConfig | undefined) => {
    if (newConfig && newConfig.Id) {
      this.state.nodeConfigs[newConfig.Id] = newConfig;
    }
  };
  render() {
    return (
      <div className="x6-root">
        <div className="x6-container" ref={this.refContainer} />
        <DndPanel graph={this.graph} onMouseUp={this.onMouseUp} />
        <PropPanel onSave={this.HandleUpdateNode} config={this.state.selectedNode && this.state.nodeConfigs[this.state.selectedNode?.id]} />
      </div>
    );
  }
}
