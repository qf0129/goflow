<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <t-layout class="layout">
    <t-header class="header" height="40px">
      <h4 class="logo">Flow</h4>
    </t-header>
    <t-layout>
      <t-aside class="aside" width="180px">Aside</t-aside>
      <t-content> <router-view /></t-content>
    </t-layout>
  </t-layout>
</template>

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
    border-right: 1px solid #f7f7f7;
    padding: 10px;
  }
}
</style>
