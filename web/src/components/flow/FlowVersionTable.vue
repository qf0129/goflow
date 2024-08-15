<template>
    <div class="flow-version-table">
        <t-table :columns="columns" :data="listData" row-key="Id" size="small" :loading="loading" stripe>
            <template #action="{ row }">
                <t-space>
                    <router-link :to="'/flow_version/' + row.Id + '/edit'">
                        <t-link theme="primary">编辑</t-link>
                    </router-link>
                    <t-link theme="primary" @click="requestPusblishVersion(row.Id)">发布</t-link>
                </t-space>
            </template>
            <template #customPublished="{ row }">
                <t-tag v-if="row.Published" theme="primary" size="small">已发布</t-tag>
            </template>
        </t-table>
    </div>
</template>


<script lang="ts" setup>
    import { ApiPublishFlowVersion, ApiQueryFlowVersions } from '@/api/flow';
    import type { FlowVersion } from '@/util/types';
    import { onMounted, ref } from 'vue';

    const props = defineProps<{ flowId: string }>()

    const columns = [
        { colKey: 'Version', title: '版本', width: 200, },
        { colKey: 'Content', title: '内容', width: 200, ellipsis: true },
        { colKey: 'CreateTime', title: '创建时间', width: 200, ellipsis: true },
        { colKey: 'customPublished', title: '已发布', width: 200, },
        { colKey: 'action', title: '操作', width: 200 },
    ];

    const emits = defineEmits(["onChangePublished"])
    const loading = ref(false);
    const listData = ref<FlowVersion[]>([]);
    const requestList = () => {
        ApiQueryFlowVersions(props.flowId).then((res) => {
            listData.value = res.data.list;
            listData.value.forEach((item) => {
                if (item.Published) {
                    emits("onChangePublished", item)
                }
            });
        });
    };

    const requestPusblishVersion = (verId: string) => {
        ApiPublishFlowVersion(verId).then((res) => {
            emits("onChangePublished", res.data)
            requestList();
        })
    }

    onMounted(() => {
        requestList();
    });

</script>

<style lang="less" scoped></style>