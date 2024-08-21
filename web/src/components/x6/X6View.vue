<template>
    <div id="x6view">

    </div>
</template>

<script lang="ts" setup>
    import { DagreLayout, GridLayout } from '@antv/layout';
    import { Cell, CellView, Edge, Graph, Shape } from '@antv/x6';
    import { Graph as GraphLib } from "@antv/graphlib";
    import { onMounted, ref } from 'vue';


    const nodes = ref([
        {
            id: 'node1',
            x: 40,
            y: 40,
            width: 80,
            height: 40,
            label: 'node1',
            shape: 'ellipse',
        },
        {
            id: 'node2',
            x: 160,
            y: 180,
            width: 80,
            height: 40,
            label: 'node2',

        },
        {
            id: 'node3',
            x: 160,
            y: 180,
            width: 80,
            height: 40,
            label: 'node3',
        },
        {
            id: 'node4',
            x: 160,
            y: 180,
            width: 80,
            height: 40,
            label: 'node4',
            children: ['node5']
        },
        {
            id: 'node5',
            x: 160,
            y: 180,
            width: 80,
            height: 40,
            label: 'node5',
            parent: 'node4',
        },
    ])
    const edges = ref([
        {
            source: 'node1',
            target: 'node2',
        },
        {
            source: 'node1',
            target: 'node3',
        },
        {
            source: 'node3',
            target: 'node4',
        },
    ])

    const node5 = new Shape.Rect({
        id: 'node5',
        x: 140,
        y: 40,
        width: 100,
        height: 40,
        label: 'rect',
        zIndex: 2,
    })


    function initView() {
        const graph = new Graph({
            container: document.getElementById("x6view") || undefined,
            width: 800,
            height: 600,
            background: {
                color: '#fff',
            },
            grid: {
                type: "mesh",
                size: 10,      // 网格大小 10px
                visible: true, // 渲染网格背景
                args: {
                    color: '#ddd', // 网格线/点颜色
                    thickness: 1,     // 网格线宽度/网格点大小
                },
            },
            embedding: true,
            panning: {
                enabled: true,
            },
            connecting: {
                snap: true,
            },
            // interacting: (cellView: CellView) => {
            // },
        });
        // graph.fromJSON({ nodes: nodes.value, edges: edges.value })

        // graph.on('node:move', (args) => {
        //     console.log('move >', args)
        // })
        // graph.on('node:moving', (args) => {
        //     console.log('moving >', args)
        // })
        // graph.on('node:moved', (args) => {
        //     console.log('moved >', args)
        // })
        graph.on('dragenter', (e: any) => {
            console.log('moved >', e)
        });

        const gridLayout = new DagreLayout({
            type: "dagre",
            rankdir: 'TB',
            ranksep: 40,
            nodesep: 30,
            controlPoints: false,
        })

        const newModel = gridLayout.layout({ nodes: nodes.value, edges: edges.value })
        graph.fromJSON(newModel)
    }

    onMounted(() => {
        initView()
    })

</script>