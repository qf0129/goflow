<template>
    <div class="flow-detail">
        <t-row align="center" :gutter="[10, 40]">
            <t-col>
                <t-button theme="default">←</t-button>
            </t-col>
            <t-col :flex="1">
                <h2> {{ flow?.Name }}</h2>
            </t-col>
            <t-col>
                <t-button>编辑</t-button>
            </t-col>
        </t-row>
        <t-row style="margin-top:20px">
            <t-col flex="1">
                <t-card title="信息" header-bordered>
                    {{ flow?.Name }}
                </t-card>
            </t-col>
        </t-row>
        <t-row>
            <t-col flex="1">
                <t-tabs :default-value="1">
                    <t-tab-panel :value="1" label="选项卡1">
                        <p style="margin: 20px">选项卡1内容区</p>
                    </t-tab-panel>
                </t-tabs>
            </t-col>
        </t-row>
    </div>
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