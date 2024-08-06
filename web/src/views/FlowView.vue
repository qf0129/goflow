<template>
  <div class="flow-list">
  <t-table  row-key="id"  :data="listData"  :columns="columns"> </t-table>
  </div>
</template>

<script setup lang="ts"">
import { ApiQueryFlow } from '@/api/flow';
import type { Flow } from '@/util/types';
import { onMounted, ref } from 'vue';

const columns = ref([
  { colKey: "Id", title: "ID", width: 200 },
  { colKey: "Name", title: "名称" },
  { colKey: "Desc", title: "描述", width: 160 },
  { colKey: "CreateTime", title: "创建时间", width: 200 },  
]);

const listData = ref<Array<Flow>>([])
const requestList = () => {
    ApiQueryFlow().then((res) => {
      console.log(res);
      listData.value = res.data.list;
    });
  console.log("requestList");
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
