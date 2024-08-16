<template>
    {{ props.content }}
    <VueFlow class="vue-flow-view" :nodes="nodes" :edges="edges" @nodes-initialized="layoutGraph">
        <Background :gap="32" />
        <Controls position="top-left" />
        <template #node-color-selector="props">
            <ColorSelectorNode :id="props.id" :data="props.data" />
        </template>
        <template #node-group="props">
            <GroupNode :data="props.data" />
        </template>
        <template #node-job="props">
            <CustomNode :data="props.data" type="job" />
        </template>
        <template #node-label="props">
            <LabelNode :id="props.id" :data="props.data" />
        </template>
        <template #edge-custom="props">
            <CustomEdge v-bind="props" @add-node="onAddNode" />
        </template>
    </VueFlow>
</template>

<script lang="ts" setup>
    import { computed, nextTick, onMounted, ref } from 'vue';
    import { Background } from '@vue-flow/background';
    import { Controls } from '@vue-flow/controls';
    import { VueFlow, Panel, useVueFlow, type Node, MarkerType, type EdgeProps, type Edge } from '@vue-flow/core'
    import { useLayout } from '@/util/useLayout';
    import ColorSelectorNode from './ColorSelectorNode.vue';
    import CustomEdge from './CustomEdge.vue';
    import shortUUID from 'short-uuid';
    import LabelNode from './LabelNode.vue';
    import CustomNode from './CustomNode.vue';
    import type { FlowContent, FlowContentNode } from '@/util/types';
    import { NodeType, NodeTypeTitle } from '@/util/consts';
    import GroupNode from './GroupNode.vue';
    // import EdgeAddBtn from './EdgeAddBtn.vue';

    const props = defineProps<{ content: string }>()

    const nodes = ref<Node[]>([
        {
            id: 'start',
            type: "label",
            data: { label: '开始' },
            width: 60,
            height: 30,
            position: { x: 50, y: 50 },
        },
        {
            id: 'end',
            type: "label",
            data: { label: '结束' },
            width: 60,
            height: 30,
            position: { x: 50, y: 200 },
        },
        {
            id: '3',
            type: "group",
            position: { x: 50, y: 200 },
            data: { label: 'parent node' },
            style: { backgroundColor: 'rgba(16, 185, 129, 0.5)', width: '200px', height: '200px' },
        },
        {
            parentNode: "3",
            extent: 'parent',
            expandParent: true,
            class: 'light',
            id: '4',
            // type: "job",
            data: { label: '444' },
            width: 150,
            height: 50,
            position: { x: 0, y: 0 },
        },
        {
            parentNode: "3",
            extent: 'parent',
            id: '5',
            type: "job",
            data: { label: '5555' },
            width: 150,
            height: 50,
            position: { x: 0, y: 0 },
        },
        {
            id: '9',
            type: "job",
            data: { label: '999' },
            width: 150,
            height: 50,
            position: { x: 0, y: 0 },
        },
    ]);

    const edges = ref<Edge[]>([
        {
            id: 'qqqq',
            source: 'start',
            target: 'end',
            type: 'custom',
        },
        {
            id: 'wwww',
            source: 'start',
            target: '3',
            type: 'custom',
        },
        {
            id: 'eeee',
            source: '4',
            target: '5',
            type: 'custom',
        },
        {
            id: 'rrrr',
            source: '3',
            target: '9',
            type: 'custom',
        },
    ]);

    const { findNode, fitView, onNodeDrag, getIntersectingNodes, isNodeIntersecting, updateNode, updateEdgeData, screenToFlowCoordinate, getEdges, getConnectedEdges, addNodes, addEdges } = useVueFlow()
    const { graph, layout } = useLayout()


    async function layoutGraph() {
        nodes.value = layout(nodes.value, edges.value)
        nextTick(() => {
            fitView()
        })
    }

    onNodeDrag((e) => {
        const intersections = getIntersectingNodes(e.node)
        const intersectionIds = intersections.map((intersection) => intersection.id)
        for (const node of nodes.value) {
            const isIntersecting = intersectionIds.includes(node.id)
            // updateNode(node.id, { class: isIntersecting ? 'intersecting' : ''})
            if (isIntersecting) {
                updateNode(node.id, { class: 'intersecting' })
                const connectedEdges = getConnectedEdges(node.id)
                for (const edge of connectedEdges) {
                    edge.style = { stroke: "#f15a16" }
                }
            } else {
                updateNode(node.id, { class: '' })
                const connectedEdges = getConnectedEdges(node.id)
                for (const edge of connectedEdges) {
                    edge.style = { stroke: "#777" }
                }
            }
        }
    })

    function removeEdge(id: string) {
        edges.value = edges.value.filter((edge) => edge.id !== id)
    }

    function onAddNode(type: string, props: EdgeProps) {
        let n = null
        switch (type) {
            case NodeType.Job:
                n = addN(type)
                addE(props.source, n.id)
                addE(n.id, props.target)
                removeEdge(props.id)
                break;
            case NodeType.Choice:
                n = addN(type)
                const n1 = addN()
                addE(props.source, n.id)
                addE(n.id, props.target)
                addE(n.id, n1.id)
                addE(n1.id, "end")
                removeEdge(props.id)
                break;
            default:
                break;
        }
    }

    function addN(type?: string, label?: string): Node {
        const nod: Node = {
            id: shortUUID().new(),
            position: { x: 0, y: 0 },
            data: { label: label || "未选择" },
            type: type || "custom",
            width: 150,
            height: 50,
        }
        nodes.value.push(nod)
        return nod
    }

    function addE(source: string, target: string): Edge {
        const edg: Edge = {
            id: shortUUID().new(),
            source: source,
            target: target,
            type: 'custom',
        }
        edges.value.push(edg)
        return edg
    }

    function addNode(node: FlowContentNode) {
        const id = Date.now().toString()
        nodes.value.push({
            id: node.Id || "",
            type: node.Type,
            position: { x: 150, y: 50 },
            data: { label: node.Name, },
        })
        console.log(nodes.value)
    }

    function convertContent(content: string) {
        if (!props.content) return
        const contentObj: FlowContent = JSON.parse(content)
        const StartNodeId: string = contentObj.StartNodeId
        const nodeMap: Record<string, FlowContentNode> = contentObj.NodeMap
        for (let key in nodeMap) {
            addNode(nodeMap[key])
        }
    }

    onMounted(() => {
        convertContent(props.content)
    })
</script>

<style lang="less">
    @import '@vue-flow/core/dist/style.css';
    @import '@vue-flow/core/dist/theme-default.css';
    @import '@vue-flow/controls/dist/style.css';

    .vue-flow-view {
        height: 100%;
        width: 100%;
        min-height: 600px;
        background-color: #f7f7f7;
    }

    .intersecting {
        border-color: #f15a16;
        background-color: #f15a16aa
    }
</style>