<template>
    <m-view class="flow-detail" title="编辑工作流">
        <template #action>
            <t-space align="center">
                <t-tag>版本: {{ flowVersion?.Version }}</t-tag>
                <t-button theme="primary">保存</t-button>
                <t-button theme="default">执行</t-button>
            </t-space>
        </template>
        <div class="edit-container">
            <X6View />
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
    import X6View from '@/components/x6/X6View.vue';

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



</script>

<style lang="less">


    .flow-detail {
        height: 100%;
    }

    .edit-container {
        height: 100%;
        padding: 20px 0;
    }

</style>