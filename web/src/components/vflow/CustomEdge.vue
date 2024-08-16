<template>
    <!-- You can use the `BaseEdge` component to create your own custom edge more easily -->
    <!-- <BaseEdge :id="id" :style="style" :path="path[0]" :marker-end="markerEnd" /> -->
    <SmoothStepEdge v-bind="props" />

    <!-- Use the `EdgeLabelRenderer` to escape the SVG world of edges and render your own custom label in a `<div>` ctx -->
    <EdgeLabelRenderer>
        <div :style="{
            pointerEvents: 'all',
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
        }" class="nodrag nopan">
            <t-dropdown :options="options" trigger="click" placement="right-top">
                <button class="custom-edge">+</button>
            </t-dropdown>
        </div>
    </EdgeLabelRenderer>
</template>


<script setup lang="ts">
    import { BaseEdge, EdgeLabelRenderer, getBezierPath, Position, SmoothStepEdge, useVueFlow, type EdgeProps } from '@vue-flow/core'
    import { computed, ref, type CSSProperties } from 'vue'
    import { NodeTypeTitle } from "@/util/consts";

    interface CustomEdgeProps<T = any> extends EdgeProps<T> {
        id: string
        sourceX: number
        sourceY: number
        targetX: number
        targetY: number
        sourcePosition: Position
        targetPosition: Position
        data: T
        markerEnd: string
        style?: CSSProperties
    }

    const props = defineProps<EdgeProps<CustomEdgeProps>>();
    const path = computed(() => getBezierPath(props))

    const emits = defineEmits(['addNode'])
    const addNode = (key: string) => {
        emits('addNode', key, props)
    }

    const options: any[] = []
    Object.keys(NodeTypeTitle).forEach((key, idx) => {
        options.push({
            content: NodeTypeTitle[key],
            value: idx,
            onClick: () => { addNode(key) }
        })
    })
</script>

<script lang="ts">
    export default {
        inheritAttrs: false,
    }
</script>

<style lang="less" scoped>
    .custom-edge {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #ccc;
        border: none;

        &:hover {
            background-color: #aaa;
        }
    }
</style>
