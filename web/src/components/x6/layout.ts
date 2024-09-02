import dagre from '@dagrejs/dagre'

export const LayoutNodes = (nodes: any[], edges: any[]) => {
    const g = new dagre.graphlib.Graph()
    g.setDefaultEdgeLabel(() => ({}))
    g.setGraph({ ranksep: 100, edgesep: 200 })

    for (const node of nodes) {
        g.setNode(node.id, { width: node.size.width || 200, height: node.size.height || 50 })
    }

    for (const edge of edges) {
        g.setEdge(edge.source, edge.target)
    }

    dagre.layout(g)

    return nodes.map((node) => {
        const pos = g.node(node.id)
        return { ...node, x: pos.x, y: pos.y }
    })
}