<template>
    <m-view class="flow-detail" title="编辑工作流">
        <template #action>
            <t-space align="center">
                <t-tag>版本: {{ flowVersion?.Version }}</t-tag>
                <t-button theme="primary" @click="onSaveFlow">保存</t-button>
                <t-button theme="default">执行</t-button>
            </t-space>
        </template>
        <div class="edit-container">
            <VueFlow class="vue-flow-view" :nodes="nodes" :edges="edges" @nodes-initialized="layoutGraph">
                <Background :gap="32" />
                <Controls position="top-left" />
                <template #node-color-selector="props">
                    <ColorSelectorNode :id="props.id" :data="props.data" />
                </template>
                <template #edge-custom="props">
                    <CustomEdge v-bind="props" @add-node="onAddNode" />
                </template>
                <template #node-label="props">
                    <LabelNode :id="props.id" :data="props.data" />
                </template>
                <template #node-job="props">
                    <CustomNode v-bind="props" type="job" />
                </template>
                <template #node-choice="props">
                    <CustomNode v-bind="props" type="choice" />
                </template>
            </VueFlow>
        </div>
    </m-view>
</template>

<script lang="ts" setup>
    import { ApiQueryFlow, ApiQueryFlowVersion } from '@/api/flow';
    import { useRoute } from 'vue-router';
    import { computed, nextTick, onMounted, ref } from 'vue';
    import { Background } from '@vue-flow/background';
    import { Controls } from '@vue-flow/controls';
    import { VueFlow, Panel, useVueFlow, type Node, MarkerType, type EdgeProps, type Edge } from '@vue-flow/core'
    import { useLayout } from '@/util/useLayout';
    import shortUUID from 'short-uuid';
    import type { Flow, FlowContent, FlowContentNode, FlowVersion } from '@/util/types';
    import { NodeType, NodeTypeTitle } from '@/util/consts';
    import ColorSelectorNode from '@/components/vflow/ColorSelectorNode.vue';
    import LabelNode from '@/components/vflow/LabelNode.vue';
    import CustomNode from '@/components/vflow/CustomNode.vue';
    import CustomEdge from '@/components/vflow/CustomEdge.vue';

    const verId = useRoute().params.id
    const flowVersion = ref<FlowVersion>();
    const requestFlowVersion = () => {
        ApiQueryFlowVersion(verId as string).then(res => {
            if (res.code == 0) {
                flowVersion.value = res.data
                requestFlow(flowVersion.value?.FlowId as string)
            }
        })
    }

    const flow = ref<Flow>()
    const requestFlow = (flowId: string) => {
        ApiQueryFlow({ id: flowId }).then(res => {
            if (res.data.list.length > 0) {
                flow.value = res.data.list[0]
            }
        })
    }

    onMounted(() => {
        requestFlowVersion();
    });


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
    ]);

    const edges = ref<Edge[]>([
        {
            id: 'qqqq',
            source: 'start',
            target: 'end',
            type: 'custom',
        },
    ]);

    const { toObject, onNodeClick, fitView, onNodeDrag, getIntersectingNodes, updateNode, getConnectedEdges } = useVueFlow()
    const { layout } = useLayout()

    const onSaveFlow = () => {
        console.log(toObject())
    }

    async function layoutGraph() {
        nodes.value = layout(nodes.value, edges.value)
        nextTick(() => {
            fitView()
        })
    }

    const selectedNode = ref<Node>()
    onNodeClick(e => {
        if (selectedNode.value) {
            updateNode(selectedNode.value.id, { class: '' })
        }
        selectedNode.value = e.node
        updateNode(selectedNode.value.id, { class: 'node-selected' })
        console.log(selectedNode.value)
    })

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
                const n1 = addN(NodeType.Job)
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

function exportFlow() {
}

function importFlow(content: string) {
    if (!content) return
    const contentObj: FlowContent = JSON.parse(content)
    const StartNodeId: string = contentObj.StartNodeId
    const nodeMap: Record<string, FlowContentNode> = contentObj.NodeMap
    for (let key in nodeMap) {
        addNode(nodeMap[key])
    }
}

</script>

<style lang="less">
    @import '@vue-flow/core/dist/style.css';
    @import '@vue-flow/core/dist/theme-default.css';
    @import '@vue-flow/controls/dist/style.css';


    .flow-detail {
        height: 100%;
    }

    .edit-container {
        height: 100%;
        padding: 20px 0;
    }

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

    .node-selected {
        // border-color: #f15a16;
        // border: 2px solid blue;
        box-shadow: 0 0 6px #5770ff;
    }
</style>