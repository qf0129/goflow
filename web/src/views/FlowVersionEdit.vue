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
            <vue-flow-view :content="flowVersion?.Content"> </vue-flow-view>
        </div>
    </m-view>
</template>

<script lang="ts" setup>
    import { ApiQueryFlow, ApiQueryFlowVersion } from '@/api/flow';
    import type { Flow, FlowVersion } from '@/util/types';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { VueFlow, Panel, useVueFlow, type Node, MarkerType, type EdgeProps } from '@vue-flow/core'

    const route = useRoute()
    const verId = route.params.id

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

<style lang="less" scoped>
    .flow-detail {
        height: 100%;
    }

    .edit-container {
        height: 100%;
        padding: 20px 0;
    }
</style>