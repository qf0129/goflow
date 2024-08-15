<script setup lang="ts">
    const props = defineProps({
        data: { type: Object, required: true },
    })
</script>

<template>
    <div class="label-node">{{ props.data.label }}</div>
</template>

<style>
    .vue-flow__node-label {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #444;
        padding: 4px;
        color: #fff;
    }
</style>