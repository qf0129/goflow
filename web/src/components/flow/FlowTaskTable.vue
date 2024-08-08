<template>
    <div>
        <t-table :columns="columns" :data="listData" row-key="Id" size="small" :loading="loading" stripe>
            <template #action="{ row }">
                <t-button variant="text">编辑</t-button>
            </template>
        </t-table>
    </div>
</template>


<script lang="ts" setup>
    import { ApiQueryFlowVersion } from '@/api/flow';
    import type { FlowVersion } from '@/util/types';
    import { onMounted, ref } from 'vue';

    const props = defineProps<{ flowId: string }>()

    const columns = [
        { colKey: 'Version', title: '版本', width: 200, },
        { colKey: 'Content', title: '内容', width: 200, ellipsis: true },
        { colKey: 'Published', title: '已发布', width: 200, },
        { colKey: 'CreateTime', title: '创建时间', width: 200, ellipsis: true },
    ];
    const loading = ref(false);
    const listData = ref<FlowVersion[]>([]);
    const requestList = () => {
        ApiQueryFlowVersion(props.flowId).then((res) => {
            listData.value = res.data.list;
        });
    };

    onMounted(() => {
        requestList();
    });

</script>
