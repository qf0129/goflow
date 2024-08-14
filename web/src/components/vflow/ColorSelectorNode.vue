<script setup lang="ts">
    import { Handle, Position, useVueFlow } from '@vue-flow/core'

    const presets: { [key: string]: string } = {
        sumi: '#1C1C1C',
        gofun: '#FFFFFB',
        byakuroku: '#A8D8B9',
        mizu: '#81C7D4',
        asagi: '#33A6B8',
        ukon: '#EFBB24',
        mushikuri: '#D9CD90',
        hiwa: '#BEC23F',
        ichigo: '#B5495B',
        kurenai: '#CB1B45',
        syojyohi: '#E83015',
        konjyo: '#113285',
        fuji: '#8B81C3',
        ayame: '#6F3381',
        torinoko: '#DAC9A6',
        kurotsurubami: '#0B1013',
        ohni: '#F05E1C',
        kokikuchinashi: '#FB9966',
        beniukon: '#E98B2A',
        sakura: '#FEDFE1',
        toki: '#EEA9A9',
    }

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

    const { updateNodeData, getConnectedEdges } = useVueFlow()

    function onSelect(color: string) {
        updateNodeData(props.id, { color, isGradient: false })

        const connectedEdges = getConnectedEdges(props.id)
        for (const edge of connectedEdges) {
            edge.style = {
                stroke: color,
            }
        }
    }

    function onGradient() {
        updateNodeData(props.id, { isGradient: true })
    }
</script>

<template>
    <Handle id="a" type="source" :position="Position.Top" />
    <div>Select a color</div>
    <div class="color-selector nodrag nopan">
        <button v-for="k in Object.keys(presets)" :key="k" :title="k" :class="{ selected: presets[k] === data.color }"
            :style="{ backgroundColor: presets[k] }" type="button" @click="onSelect(presets[k])" />

        <button class="animated-bg-gradient" title="gradient" type="button" @click="onGradient" />
    </div>
</template>


<style>
    .vue-flow__node-color-selector {
        border: 1px solid #777;
        padding: 10px;
        border-radius: 10px;
        background: #f5f5f5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        max-width: 250px
    }

    .vue-flow__node-color-selector .color-selector {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 90%;
        margin: auto;
        gap: 4px
    }

    .vue-flow__node-color-selector .color-selector button {
        border: none;
        cursor: pointer;
        padding: 5px;
        width: 25px;
        height: 25px;
        border-radius: 8px;
        box-shadow: 0 0 10px #0000004d
    }

    .vue-flow__node-color-selector .color-selector button:hover {
        box-shadow: 0 0 0 2px #2563eb;
        transition: box-shadow .2s
    }

    .vue-flow__node-color-selector .color-selector button.selected {
        box-shadow: 0 0 0 2px #2563eb
    }
</style>