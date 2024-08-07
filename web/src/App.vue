<template>
  <t-layout class="layout">
    <t-header class="header" height="40px">
      <h4 class="logo">Flow</h4>
    </t-header>
    <t-layout>
      <t-aside>
        <t-menu :value="activedMenuItem" style="border-right: 1px solid #f7f7f7;" :onChange="handleChange">
          <t-menu-item to="/flow" value="flow_list"> 任务流 </t-menu-item>
          <t-menu-item to="/order" value="order_view"> 工单 </t-menu-item>
        </t-menu>
      </t-aside>
      <t-content> <router-view /></t-content>
    </t-layout>
  </t-layout>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { RouterView } from "vue-router";

  const activedMenuItem = ref("");

  const handleChange = (value: string) => {
    activedMenuItem.value = value;
  };

</script>

<style scoped lang="less">
  .t-layout {
    background-color: #fff;
  }

  .layout {
    height: 100%;

    .header {
      display: flex;
      align-items: center;
      background-color: #f7f7f7;

      .logo {
        margin: 0 20px;
        font-weight: 600;
        font-size: 15px;
      }
    }

    .aside {
      width: 180px;
      border-right: 1px solid #f7f7f7;
      padding: 10px;
    }
  }
</style>
