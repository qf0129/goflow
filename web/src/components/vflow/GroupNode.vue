<script setup lang="ts">
    const props = defineProps({
        data: { type: Object, required: true },
    })
</script>

<template>
    <div class="group-node-label">{{ props.data.label }}</div>
</template>

<style>
    .vue-flow__node-group {
        background: #7bbfffc0;
        /* border: 1px solid #333; */
        /* height: 50px;
        width: 150px; */
        /* border-radius: 4px; */
    }

    .group-node-label {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        padding: 0 5px;
        color: #333;
    }
</style>