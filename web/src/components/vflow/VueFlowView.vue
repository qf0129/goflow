<template>
    <VueFlow class="vue-flow-view" :nodes="nodes" :edges="edges" @nodes-initialized="layoutGraph('TB')">
        <Background :gap="32" />
        <Controls position="top-left" />
        <Panel position="top-right">
            <button type="button" @click="addNode">Add a node</button>
        </Panel>
        <template #node-color-selector="props">
            <ColorSelectorNode :id="props.id" :data="props.data" />
        </template>
        <template #node-empty="props">
            <EmptyNode :id="props.id" :data="props.data" />
        </template>
        <template #node-start="props">
            <StartNode :id="props.id" :data="props.data" />
        </template>
        <template #node-end="props">
            <EndNode :id="props.id" :data="props.data" />
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
    import { VueFlow, Panel, useVueFlow, type Node, MarkerType, type EdgeProps } from '@vue-flow/core'
    import { useLayout } from '@/util/useLayout';
    import ColorSelectorNode from './ColorSelectorNode.vue';
    import EmptyNode from './EmptyNode.vue';
    import CustomEdge from './CustomEdge.vue';
    import shortUUID from 'short-uuid';
    import EndNode from './EndNode.vue';
    // import EdgeAddBtn from './EdgeAddBtn.vue';



    const nodes = ref<Node[]>([
        {
            id: '1',
            position: { x: 50, y: 50 },
            data: { label: 'Node 1', },
            type: "start",
            width: 60,
        },
        {
            id: '2',
            position: { x: 50, y: 200 },
            data: { label: 'Node 2', },
            width: 60,
            type: "end",
        },
        {
            id: '3',
            position: { x: 50, y: 200 },
            data: { label: 'Node 3', },
            width: 60,
            type: "end",
        },
    ]);

    const edges = ref([
        {
            id: 'qqqq',
            source: '1',
            target: '2',
            type: 'custom',
        },
        {
            id: 'wwww',
            source: '1',
            target: '3',
            type: 'custom',
        },
        // {
        //     id: 'wwww',
        //     source: '2',
        //     target: '3',
        //     type: 'custom',
        // },
        // {
        //     id: 'eeeee',
        //     source: '3',
        //     target: '4',
        //     type: 'custom',
        //     // label: 'custom label text',
        //     // animated: true,
        // },
    ]);

    const { findNode, fitView, onNodeDrag, getIntersectingNodes, isNodeIntersecting, updateNode, updateEdgeData, screenToFlowCoordinate, getEdges, getConnectedEdges, addNodes, addEdges } = useVueFlow()
    const { graph, layout, previousDirection } = useLayout()


    async function layoutGraph(direction: string) {
        nodes.value = layout(nodes.value, edges.value, direction)
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
        // console.log(111, props)

        const short = shortUUID()

        const nodeId = short.new()
        const n: Node = {
            id: nodeId,
            position: { x: 150, y: 50 },
            data: { label: `Node: ` + type },
        }
        nodes.value.push(n)

        edges.value = edges.value.concat([
            {
                id: short.new(),
                source: props.source,
                target: nodeId,
                type: 'custom',
            },
            {
                id: short.new(),
                source: nodeId,
                target: props.target,
                type: 'custom',
            }
        ])
        removeEdge(props.id)
    }

    function addNode() {
        const id = Date.now().toString()
        nodes.value.push({
            id,
            position: { x: 150, y: 50 },
            data: { label: `Node ${id}`, },
        })
        console.log(nodes.value)
    }
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