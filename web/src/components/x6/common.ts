import { Edge, Node } from "@antv/x6";
import { BranchConfig, NodeConfig } from "../../utils/types";
import { nanoid } from "nanoid";
import dagre from "@dagrejs/dagre";
import { NodeTypeTitle } from "../../utils/consts";

const DefaultWidth = 200
const DefaultHeight = 28
const PaddingSize = 28

const getNodeShape = (nodeType: string | undefined) => {
    if (nodeType === "start") return "label";
    if (nodeType === "end") return "label";
    if (nodeType === "foreach" || nodeType === "parallel") return "group";
    return "custom";
};

export const CreateNode = (id: string | undefined, shape: string | undefined, data?: NodeConfig, parentNode?: Node.Metadata): Node.Metadata => {
    return {
        id: id,
        shape: shape,
        x: 0,
        y: 0,
        width: DefaultWidth,
        height: DefaultHeight,
        data: data,
        children: [],
        zIndex: parentNode ? (parentNode.zIndex || 0) + 1 : 0,
    };
};

const layout = (nodes: Node.Metadata[], edges: Edge.Metadata[], parentNode?: Node.Metadata): Node.Metadata[] => {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ ranksep: 40, edgesep: 160 });
    nodes.forEach((node) => {
        g.setNode(node.id as string, { width: node.width, height: node.height });
    });
    edges.forEach((edge) => {
        g.setEdge(edge.source as string, edge.target as string);
    });
    dagre.layout(g);

    nodes.forEach((node) => {
        const n = g.node(node.id as string);
        node.x = n.x - n.width / 2;
        node.y = n.y - n.height / 2;
        if (parentNode) {
            node.x += parentNode.x || 0 + PaddingSize;
            node.y += parentNode.y || 0 + PaddingSize * 2;
        }
    });
    return nodes;
};

const getMaxWidth = (nodes: Node.Metadata[]) => {
    let minX = 0;
    let maxX = 0;
    for (const node of nodes) {
        if (typeof node.x !== "number" || typeof node.width !== "number") continue
        if (minX === 0) minX = node.x || 0
        if (maxX === 0) maxX = node.x + node.width || 0
        if (node.x < minX) minX = node.x
        if (node.x + node.width > maxX) maxX = node.x + node.width
    }
    return maxX - minX;
}

export const LayoutNodes = (nodes: Node.Metadata[], edges: Edge.Metadata[]): Node.Metadata[] => {
    const result: Node.Metadata[] = [];

    function layoutChildren(nodes: Node.Metadata[], edges: Edge.Metadata[], parentNode?: Node.Metadata) {
        for (const node of nodes) {
            if (node.childrenNodes?.length) {
                layoutChildren(node.childrenNodes, node.childrenEdges, node);
                const last = node.childrenNodes[node.childrenNodes.length - 1];
                if (last && last.y && last.height) {
                    node.height = last.y + last.height + PaddingSize;
                    node.width = getMaxWidth(node.childrenNodes) + PaddingSize * 2;
                }
            } else {
                if (node.data.Name && node.data.Type) {
                    node.width = (node.data.Name?.length + NodeTypeTitle[node.data.Type]?.length + 3) * 14 || DefaultWidth;
                }
            }
        }
        result.push(...layout(nodes, edges, parentNode));
    }

    function autoPostion(nodes: Node.Metadata[], parent?: Node.Metadata) {
        for (const node of nodes) {
            const child = result.find((no) => no.id === node.id)
            if (child && typeof child.x === "number" && typeof child.y === "number" && typeof parent?.x === "number" && typeof parent?.y === "number") {
                child.x += parent.x
                child.y += parent.y
            }

            if (node.childrenNodes?.length) {
                autoPostion(node.childrenNodes, node);
            }
        }

    }

    const childrenNodeIds = [...new Set(nodes.flatMap((n) => n.children))];

    const rootNodeIds = nodes.flatMap((n) => (childrenNodeIds.includes(n.id) ? [] : n.id));

    let rootNodes = nodes.filter((n) => rootNodeIds.includes(n.id));
    rootNodes = layout(rootNodes, edges);
    layoutChildren(rootNodes, edges);
    autoPostion(rootNodes);
    return result;
};

export const toBranch = (nodes: Node[] | undefined, edges: Edge[] | undefined): BranchConfig | undefined => {
    if (!nodes || !edges) return;
    const startNodeId = nodes.find((node) => node.shape === "start")?.id as string;
    if (!startNodeId) return;

    var nodeConfigs: NodeConfig[] = [];
    function addNodeConfig(nodeId: string) {
        if (!edges) return;
        const node = nodes?.find((node) => node.id === nodeId);
        if (node) {
            const nextEdge = edges.find((edge) => edge.getSourceCellId() === nodeId);
            if (nextEdge) {
                node.data["NextId"] = nextEdge.target;
            }
            nodeConfigs.push(node.data as NodeConfig);
            if (nextEdge) {
                addNodeConfig(nextEdge.getTargetCellId());
            }
        }
    }
    addNodeConfig(startNodeId);
    return {
        StartId: startNodeId,
        Nodes: nodeConfigs,
    };
};

export const readBranchNodes = (branch: BranchConfig, parentNode?: Node.Metadata): { nodes: Node.Metadata[]; edges: Edge.Metadata[] } => {
    if (!branch || !branch.StartId || !branch.Nodes) return { nodes: [], edges: [] };
    var nodes: Node.Metadata[] = [];
    var edges: Edge.Metadata[] = [];

    branch.Nodes.forEach((nodeConfig) => {
        const node = CreateNode(nodeConfig.Id, getNodeShape(nodeConfig.Type), nodeConfig, parentNode);
        nodes.push(node);
        if (nodeConfig.Type === "choice" && nodeConfig.Choices?.length) {
            for (let i = 0; i < nodeConfig.Choices.length; i++) {
                const choice = nodeConfig.Choices[i];
                if (!choice.NextId) continue;
                edges.push(makeEdge(node.id, choice.NextId, i + 1, choice.Label || "选择" + (i + 1)));
            }
            if (nodeConfig.NextId) {
                edges.push(makeEdge(node.id, nodeConfig.NextId, 0, nodeConfig.ChoiceDefaultLabel || "默认"));
            }
        } else {
            if (nodeConfig.NextId) {
                edges.push(makeEdge(node.id, nodeConfig.NextId));
            }
        }

        if (nodeConfig.Branchs?.length) {
            nodeConfig.Branchs.forEach((b) => {
                const { nodes: ns, edges: es } = readBranchNodes(b, node);
                node.childrenNodes = ns;
                node.childrenEdges = es;
            });
        }
    });

    return { nodes, edges };
};

export const readBranch = (branch: BranchConfig): { nodes: Node.Metadata[]; edges: Edge.Metadata[] } => {
    if (!branch || !branch.StartId || !branch.Nodes) return { nodes: [], edges: [] };

    var nodes: Node.Metadata[] = [];
    var edges: Edge.Metadata[] = [];

    function readEdges(ess: Edge.Metadata[]) {
        edges.push(...ess);
    }

    function readNodes(nss: Node.Metadata[]) {
        nss.forEach((n) => {
            nodes.push(n);
            if (n.childrenNodes?.length) {
                n.children = n.childrenNodes.map((c: Node.Metadata) => c.id);
                readNodes(n.childrenNodes);
            }
            if (n.childrenEdges?.length) {
                readEdges(n.childrenEdges);
            }
        });
    }

    const { nodes: ns, edges: es } = readBranchNodes(branch);
    readNodes(ns);
    readEdges(es);
    return { nodes, edges };
};

const makeEdge = (source: any, target: any, childIndex?: number, label?: string): Edge.Metadata => {
    return {
        id: nanoid(),
        source: source,
        target: target,
        data: {
            index: childIndex || 0,
        },
        labels: [{ attrs: { label: { text: label || "" } } }],
    };
};
