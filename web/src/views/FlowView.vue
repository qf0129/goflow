<template>
  <div class="flow-list">
    <t-table row-key="Id" :data="listData" :columns="columns" @row-click="onRowClick" hover>
    </t-table>
  </div>
</template>

<script setup lang="ts">
  import { ApiQueryFlow } from '@/api/flow';
  import type { Flow } from '@/util/types';
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const columns = ref([
    { colKey: "Name", title: "名称" },
    { colKey: "Desc", title: "描述", width: 160 },
    { colKey: "CreateTime", title: "创建时间", width: 240, ellipsis: true },
    { colKey: "Id", title: "Id", width: 200 },
  ]);
  const listData = ref<Array<Flow>>([])

  const router = useRouter()
  const onRowClick = ({ row }: { row: Flow }) => {
    router.push({ name: "flow_detail", params: { id: row.Id } });
  };
  const requestList = () => {
    ApiQueryFlow().then((res) => {
      listData.value = res.data.list;
    });
  };

  onMounted(() => {
    requestList();
  });
</script>

<style lang="less" scoped>
  .flow-list {
    width: 100%;
    height: 100%;
    padding: 10px;
  }
</style>
