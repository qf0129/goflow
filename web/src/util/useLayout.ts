import dagre from "@dagrejs/dagre";
import { Position, useVueFlow, type Edge, type GraphNode, type Node } from "@vue-flow/core";
import { ref } from "vue";

/**
 * Composable to run the layout algorithm on the graph.
 * It uses the `dagre` library to calculate the layout of the nodes and edges.
 */
export function useLayout() {
  const { findNode } = useVueFlow();

  const graph = ref(new dagre.graphlib.Graph());


  function layout(nodes: Array<Node>, edges: Array<Edge>): Array<Node> {
    // we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
    const dagreGraph = new dagre.graphlib.Graph();

    graph.value = dagreGraph;

    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: 'TB' });

    for (const node of nodes) {
      // if you need width+height of nodes for your layout, you can use the dimensions property of the internal node (`GraphNode` type)
      const graphNode = findNode(node.id) as GraphNode;

      dagreGraph.setNode(node.id, { width: graphNode.dimensions.width || 150, height: graphNode.dimensions.height || 50 });
    }

    for (const edge of edges) {
      dagreGraph.setEdge(edge.source, edge.target);
    }

    dagre.layout(dagreGraph);

    // set nodes with updated positions
    return nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      // console.log(">>>", node.id, node)
      node.width = Number(node.width) || 150
      node.height = Number(node.height) || 50
      return {
        ...node,
        targetPosition: Position.Top,
        sourcePosition: Position.Bottom,
        position: { x: nodeWithPosition.x - node.width / 2, y: nodeWithPosition.y - node.height / 2 },
      };
    });
  }

  return { graph, layout };
}
