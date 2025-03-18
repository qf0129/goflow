import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Cell, Edge, Graph, Node } from "@antv/x6";
import DndPanel from "./dnd/DndPanel";
import { nanoid } from "nanoid";
import { FlowStatusBgColor, NodeType, NodeTypeTitle } from "../../utils/consts";
import { CreateNode, LayoutNodes } from "./common";
import { EmptyNode } from "./nodes/EmptyNode";
import { CustomNode } from "./nodes/CustomNode";
import { GroupNode } from "./nodes/GroupNode";
import { LabelNode } from "./nodes/LabelNode";
import { FlowStep } from "../../utils/types";

// Graph.registerNode("start", StartNode);
// Graph.registerNode("end", EndNode);
Graph.registerNode("label", LabelNode);
Graph.registerNode("custom", CustomNode);
Graph.registerNode("empty", EmptyNode);
Graph.registerNode("group", GroupNode);

export interface X6CoreRef {
  nodes: Node.Metadata[];
  edges: Edge.Metadata[];
  refresh: () => void;
  selectNode: (node: Node | undefined) => void;
  unSelectNode: () => void;
}

interface X6CoreProps {
  defaultNodes?: Node.Metadata[];
  defaultEdges?: Edge.Metadata[];
  steps?: FlowStep[];
  onSelectNode?: (node: Node | undefined) => void;
  onAddNode?: (node: Node.Metadata | undefined) => void;
  showDndPanel?: boolean;
  width?: string;
  // configMap?: Record<string, NodeConfig>;
}

export const X6Core = forwardRef<X6CoreRef, X6CoreProps>((props, ref) => {
  const refContainer = useRef<HTMLDivElement>(null);
  const [graph, setGraph] = useState<Graph | null>(null);
  const nodes = useRef<Node.Metadata[]>([]);
  const edges = useRef<Edge.Metadata[]>([]);
  const selectedNode = useRef<Node | undefined>(undefined);

  const [startNodeId] = useState(nanoid());
  const [endNodeId] = useState(nanoid());
  const [firstEmptyNodeId] = useState(nanoid());

  useImperativeHandle(ref, () => ({
    nodes: nodes.current,
    edges: edges.current,
    refresh,
    selectNode,
    unSelectNode,
  }));

  useEffect(() => {
    if (refContainer.current && !graph) {
      const graph = new Graph({
        container: refContainer.current,
        interacting: { nodeMovable: false, edgeMovable: false },
        mousewheel: { enabled: true, modifiers: ["ctrl", "meta"] },
        scaling: { min: 0.3, max: 2 },
        background: { color: "#eee" },
        panning: true,
        autoResize: true,
      });
      // @ts-ignore
      window.__x6_instances__ = [graph];
      graph.on("node:click", ({ node }) => selectNode(node));
      graph.on("blank:click", ({}) => unSelectNode());
      setGraph(graph);
    }

    if (props.defaultNodes?.length && props.defaultEdges?.length) {
      nodes.current = props.defaultNodes;
      edges.current = props.defaultEdges;
    } else {
      nodes.current = [];
      edges.current = [];
      addNode(startNodeId, "label", "start");
      addNode(endNodeId, "label", "end");
      addNode(firstEmptyNodeId, "empty");
      // addNode(firstEmptyNodeId, "group");
      addEdge(startNodeId, firstEmptyNodeId);
      addEdge(firstEmptyNodeId, endNodeId);
    }
    refresh();
    refreshStatus();
  }, [graph, props.defaultNodes, props.defaultEdges]);

  useEffect(() => {
    refreshStatus();
  }, [props.steps]);

  const refreshStatus = () => {
    const statusLevel = ["ready", "cancelled", "completed", "waiting", "failed", "running"];
    let nodeStatus: Record<string, string[]> = {};
    for (const step of props.steps || []) {
      if (!nodeStatus[step.NodeId as string]) {
        nodeStatus[step.NodeId as string] = [step.Status as string];
      } else {
        if (statusLevel.indexOf(step.Status as string) > statusLevel.indexOf(nodeStatus[step.NodeId as string][0])) {
          nodeStatus[step.NodeId as string].unshift(step.Status as string);
        } else {
          nodeStatus[step.NodeId as string].push(step.Status as string);
        }
      }
    }
    for (let nodeId in nodeStatus) {
      const node = graph?.getCellById(nodeId as string) as Node;
      if (!node || node?.shape == "label" || node?.shape == "empty") continue;
      if (node?.shape == "custom") {
        node?.attr("body/fill", FlowStatusBgColor[nodeStatus[nodeId as string][0]]);
      } else if (node?.shape == "group") {
        node?.attr("infoRect/fill", FlowStatusBgColor[nodeStatus[nodeId as string][0]]);
      }
      node.attr("title/text", NodeTypeTitle[node.data.Type] + " | " + (node.data.Name as string) + " (" + nodeStatus[nodeId as string].length + ")");
    }
  };

  const refresh = () => {
    if (graph == null) return;
    nodes.current = LayoutNodes(nodes.current, edges.current);
    graph.fromJSON({ nodes: nodes.current, edges: edges.current });
    graph.centerContent();
    graph.getNodes().forEach((n: Node) => {
      const config = n.getData();
      if (n.shape == "custom" || n.shape == "group") {
        if (config && config.Type) {
          n.attr("title/text", NodeTypeTitle[config.Type] + " | " + (config.Name || ""));
        }
      } else if (n.shape == "label") {
        if (config.Type == "start") n.attr("title/text", "开始");
        else if (config.Type == "end") n.attr("title/text", "结束");
      }
    });
  };

  const selectNode = (node: Node | undefined) => {
    if (!node || node.shape == "label") return;
    if (selectedNode.current) {
      if (selectedNode.current.id == node?.id) {
        return;
      } else {
        selectedNode.current.attr("body/stroke", "#000");
        selectedNode.current.attr("body/strokeWidth", 1);
      }
    }
    node?.attr("body/stroke", "#22e");
    node?.attr("body/strokeWidth", 2);
    selectedNode.current = node;
    props.onSelectNode?.(node);
  };

  const unSelectNode = () => {
    if (selectedNode.current) {
      selectedNode.current.attr("body/stroke", "#000");
      selectedNode.current.attr("body/strokeWidth", 1);
    }
    selectedNode.current = undefined;
    props.onSelectNode?.(undefined);
  };

  const addEdge = (source: any, target: any, label?: string, childIndex?: number) => {
    edges.current.push({
      id: nanoid(),
      source: source,
      target: target,
      data: {
        index: childIndex || 0,
      },
      // router: { name: "manhattan" },
      // connector: { name: "rounded" },
      labels: [{ attrs: { label: { text: label || "" } } }],
    });
  };

  const addNode = (id: string, shape: string, nodeType?: string) => {
    const node = CreateNode(id, shape, {
      Id: id,
      Type: nodeType || shape,
      Name: nodeType ? NodeTypeTitle[nodeType] + "节点" : "",
    });
    nodes.current.push(node);
    props.onAddNode?.(node);
  };

  const addNodeOnEdge = (edge: Edge, nodeType: string) => {
    const nodeId = nanoid();
    if (nodeType == NodeType.Choice) {
      const branchId = nanoid();
      addNode(nodeId, "custom", nodeType);
      addNode(branchId, "empty");
      addEdge(nodeId, edge.getTargetCellId(), "默认分支", 0);
      addEdge(nodeId, branchId, "选择1", 1);
      addEdge(branchId, endNodeId);
    } else {
      addNode(nodeId, "custom", nodeType);
      addEdge(nodeId, edge.getTargetCellId());
    }
    edges.current.forEach((e: any) => {
      if (e.id == edge.id) e.target = nodeId;
    });
    return nodeId;
  };

  const addNodeOnEmptyNode = (emptyNode: Node<Node.Properties>, nodeType: string) => {
    if (!graph) return;
    const toEdge = graph.getConnectedEdges(emptyNode).find((e: Edge) => e.getSourceCellId() == emptyNode.id);
    const fromEdge = graph.getConnectedEdges(emptyNode).find((e: Edge) => e.getTargetCellId() == emptyNode.id);
    if (!toEdge || !fromEdge) return;

    const nodeId = nanoid();
    if (nodeType == NodeType.Choice) {
      const branchId = nanoid();
      addNode(nodeId, "custom", nodeType);
      addNode(branchId, "empty");
      addEdge(fromEdge.getSourceCellId(), nodeId);
      addEdge(nodeId, toEdge.getTargetCellId(), "默认分支", 0);
      addEdge(nodeId, branchId, "选择1", 1);
      addEdge(branchId, endNodeId);
    } else {
      addNode(nodeId, "custom", nodeType);
      addEdge(fromEdge.getSourceCellId(), nodeId);
      addEdge(nodeId, toEdge.getTargetCellId());
    }

    nodes.current = nodes.current.filter((c) => c.id !== emptyNode.id);
    edges.current = edges.current.filter((c) => c.id !== toEdge.id && c.id !== fromEdge.id);
    return nodeId;
  };

  const onMouseUp = (cell: Cell, nodeType: string) => {
    let newNodeId = "";
    if (cell.isEdge()) {
      const edge = cell as Edge;
      newNodeId = addNodeOnEdge(edge, nodeType);
    } else {
      const node = cell as Node;
      newNodeId = addNodeOnEmptyNode(node, nodeType) || "";
    }
    refresh();
    graph?.getCellById(newNodeId);
    selectNode(graph?.getCellById(newNodeId) as Node);
  };

  return (
    <div
      className="x6-root"
      style={{
        display: "flex",
        position: "relative",
        width: props.width || "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div className="x6-container" ref={refContainer} style={{ flex: 1, height: "100%" }} />
      {props.showDndPanel && <DndPanel graph={graph} onMouseUp={onMouseUp} />}
    </div>
  );
});
