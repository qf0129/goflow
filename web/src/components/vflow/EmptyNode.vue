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
    <Handle type="target" :position="Position.Top" />
    <div class="empty-node"></div>
    <Handle type="source" :position="Position.Bottom" />
</template>

<style>
    .vue-flow__node-empty {
        width: 80px;
        height: 4px;
        background: transparent;
    }
</style>