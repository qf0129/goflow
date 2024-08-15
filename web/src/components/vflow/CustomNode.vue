<script setup lang="ts">
    import { NodeTypeTitle } from '@/util/consts';
    import { CircleIcon } from 'tdesign-icons-vue-next';

    const props = defineProps({
        type: { type: String, required: true },
        data: { type: Object, required: true },
    })
</script>

<template>
    <div class="custom-node">
        <div class="custom-node-icon">
            <CircleIcon />
        </div>
        <div class="custom-node-right">
            <div class="custom-node-right-type">{{ NodeTypeTitle[props.type] }}</div>
            <div class="custom-node-right-label">{{ props.data.label }}</div>
        </div>
    </div>
</template>

<style>
    .custom-node {
        display: flex;
        align-items: center;
        background: #fff;
        border: 1px solid #333;
        /* height: 40px; */
        width: 160px;
        border-radius: 4px;
    }

    .custom-node-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
    }

    .custom-node-right {
        border-left: 1px solid #333;
        padding: 0 5px;
    }

    .custom-node-right-type {
        font-size: 11px;
        color: #333;
    }

    .custom-node-right-label {
        font-size: 14px;
        color: #333;
    }
</style>