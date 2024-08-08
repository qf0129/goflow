<template>
    <m-view class="flow-detail">
        <template #title>
            <h2>工作流：{{ flow?.Name }}</h2>
        </template>
        <template #action>
            <router-link :to="'/flow/' + flowId + '/edit'">
                <t-button>编辑</t-button>
            </router-link>
        </template>

        <t-row style="margin-top:20px" :gutter="[20, 20]">
            <t-col :span="12">
                <t-card title="信息" size="small" :bordered="false">
                    {{ flow?.Name }}
                </t-card>
            </t-col>
            <t-col :span="12">
                <t-card title="版本" size="small" :bordered="false">
                    <flow-version-table v-if="flow" :flowId="flow?.Id" />
                </t-card>
            </t-col>
            <t-col :span="12">
                <t-card title="运行历史" size="small" :bordered="false">
                    <flow-task-table v-if="flow" :flowId="flow?.Id" />
                </t-card>
            </t-col>
        </t-row>
    </m-view>
</template>

<script lang="ts" setup>
    import { ApiQueryFlow } from '@/api/flow';
    import type { Flow } from '@/util/types';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    const route = useRoute()
    const flowId = route.params.id

    const flow = ref<Flow>()
    const requestData = () => {
        ApiQueryFlow({ id: flowId }).then(res => {
            console.log(res)
            if (res.data.list.length > 0) {
                flow.value = res.data.list[0]
            }
        })
    }

    onMounted(() => {
        requestData()
    })

</script>

<style lang="less" scoped>
    .flow-detail {
        padding: 20px;
    }
</style>