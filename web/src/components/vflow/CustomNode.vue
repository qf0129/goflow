<script setup lang="ts">
    import { NodeTypeTitle } from '@/util/consts';

    const props = defineProps({
        type: { type: String, required: true },
        data: { type: Object, required: true },
    })
</script>

<template>
    <div class="custom-node">
        <div class="custom-node-type">{{ NodeTypeTitle[props.type] }}</div>
        <div class="custom-node-label">{{ props.data.label }}</div>
    </div>
</template>

<style>

    .vue-flow__node-custom {
        border: 1px solid #333;
        /* overflow: hidden; */
    }

    .custom-node {
        background: #ffffff77;
        border-radius: 4px;
        /* height: 50px;
        width: 150px; */
    }

    .custom-node-type {
        height: 20px;
        line-height: 20px;
        font-size: 11px;
        padding: 0 5px;
        color: #333;
        background-color: #cfcfcf77;
    }

    .custom-node-label {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        padding: 0 5px;
        color: #333;
    }
</style>