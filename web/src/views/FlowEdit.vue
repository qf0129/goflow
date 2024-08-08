<template>
    <m-view class="flow-detail" title="编辑工作流">
        <template #action>
            <t-input-adornment prepend="版本">
                <t-select :value="currentVersion?.Version">
                    <t-option v-for="item in versionList" :key="item.Id" :label="item.Version" :value="item.Version"
                        @change="changeVersion(item)" />
                </t-select>
            </t-input-adornment>
            <t-button theme="primary">保存</t-button>
            <t-button theme="default">执行</t-button>
        </template>
        <div class="edit-container">
            <vue-flow-view> </vue-flow-view>
        </div>
    </m-view>
</template>

<script lang="ts" setup>
    import { ApiQueryFlow, ApiQueryFlowVersion } from '@/api/flow';
    import type { Flow, FlowVersion } from '@/util/types';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';

    const route = useRoute()
    const flowId = route.params.id

    const flow = ref<Flow>()
    const requestFlow = () => {
        ApiQueryFlow({ id: flowId }).then(res => {
            if (res.data.list.length > 0) {
                flow.value = res.data.list[0]
            }
        })
    }

    const versionList = ref<FlowVersion[]>([]);
    const requestVersionList = () => {
        ApiQueryFlowVersion(flowId as string).then((res) => {
            versionList.value = res.data.list;
            versionList.value.forEach((item) => {
                if (item.Published) {
                    changeVersion(item)
                }
            });
            if (!currentVersion.value) {
                changeVersion(versionList.value[0])
            }
        });
    };

    const currentVersion = ref<FlowVersion>();
    const changeVersion = (flowVer: FlowVersion) => {
        currentVersion.value = flowVer

    };

    onMounted(() => {
        requestFlow()
        requestVersionList();
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