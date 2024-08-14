<script setup lang="ts">
    import { Handle, Position, useVueFlow } from '@vue-flow/core'

    const props = defineProps({
        id: {
            type: String,
            required: true,
        },
        data: {
            type: Object,
            required: true,
        },
    })
</script>

<template>
    <div class="start-node">开始</div>
</template>

<style>
    .vue-flow__node-start {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #444;
        padding: 4px;
        color: #fff;
    }
</style>