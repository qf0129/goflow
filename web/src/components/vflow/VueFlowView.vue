<template>
    <VueFlow class="vue-flow-view" :nodes="nodes" :edges="edges" @nodes-initialized="layoutGraph('TB')">
        <Background :gap="32" />
        <Controls position="top-left" />
        <Panel position="top-right">
            <button type="button" @click="addNode">Add a node</button>
        </Panel>
        <Panel ref="panelEl" position="bottom-right" :class="{ intersecting: isIntersectingWithPanel }"> </Panel>
        <template #node-mynode1="props">
            <div style="border: 2px solid red">
                <h2>MyNode1</h2>
            </div>
        </template>
        <!-- <template #edge-button="props">
            <EdgeAddBtn :id="props.id" :source-x="props.sourceX" :source-y="props.sourceY" :target-x="props.targetX"
                :target-y="props.targetY" :source-position="props.sourcePosition"
                :target-position="props.targetPosition" :marker-end="props.markerEnd" :style="props.style" />
        </template> -->
    </VueFlow>
</template>

<script lang="ts" setup>
    import { computed, nextTick, ref } from 'vue';
    import { Background } from '@vue-flow/background';
    import { Controls } from '@vue-flow/controls';
    import { VueFlow, Panel, useVueFlow, type Node, MarkerType } from '@vue-flow/core'
    import { useLayout } from '@/util/useLayout';
    // import EdgeAddBtn from './EdgeAddBtn.vue';



    const nodes = ref<Array<Node>>([
        {
            id: '1',
            position: { x: 50, y: 50 },
            data: { label: 'Node 1', },
        },
        {
            id: '2',
            position: { x: 50, y: 200 },
            data: { label: 'Node 2', },
            style: { backgroundColor: 'rgba(16, 185, 129, 0.5)', },
        },
        {
            id: '3',
            // type: 'mynode1',
            position: { x: 50, y: 200 },
            data: { label: 'Node 3', },
        },
        {
            id: '4',
            position: { x: 50, y: 200 },
            data: { label: 'Node 4', },
        },
        {
            id: '5',
            style: { borderColor: 'red' },
            data: { label: 'Drag me  over another node' },
            position: { x: 200, y: 200 },
        },
    ]);

    const edges = ref([
        {
            id: 'e1->2',
            source: '1',
            target: '2',
        },
        {
            id: 'e2->3',
            source: '2',
            target: '3',
            // type: 'smoothstep',
            // label: 'custom label text',
            // animated: true,
            markerEnd: MarkerType.Arrow,
        },
        {
            id: '2->4',
            source: '2',
            target: '4',
            // type: 'button',
            // animated: true,
            markerEnd: MarkerType.ArrowClosed,
        },
    ]);

    const { fitView, onNodeDrag, getIntersectingNodes, isNodeIntersecting, updateNode, screenToFlowCoordinate, getEdges } = useVueFlow()
    const { graph, layout, previousDirection } = useLayout()

    async function layoutGraph(direction: string) {
        nodes.value = layout(nodes.value, edges.value, direction)
        nextTick(() => {
            fitView()
        })
    }
    const panelEl = ref()
    const isIntersectingWithPanel = ref(false)
    const panelPosition = computed(() => {
        if (!panelEl.value) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            }
        }

        const { left, top, width, height } = panelEl.value.$el.getBoundingClientRect()

        return {
            ...screenToFlowCoordinate({ x: left, y: top }),
            width,
            height,
        }
    })

    onNodeDrag(({ node: draggedNode }) => {
        const edges = getEdges.value
        console.log(edges)
        const intersections = getIntersectingNodes(draggedNode)
        const intersectionIds = intersections.map((intersection) => intersection.id)

        isIntersectingWithPanel.value = isNodeIntersecting(draggedNode, panelPosition.value)
        console.log(draggedNode.id)
        for (const node of nodes.value) {
            const isIntersecting = intersectionIds.includes(node.id)

            updateNode(node.id, {
                class: isIntersecting ? 'intersecting' : ''
            })
        }
    })

    function addNode() {
        const id = Date.now().toString()

        nodes.value.push({
            id,
            position: { x: 150, y: 50 },
            data: { label: `Node ${id}`, },
        })
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