
export const CustomNode = {
    width: 200,
    height: 50,
    attrs: {
        body: {
            // stroke: '#5F95FF',
            stroke: '#000',
            strokeWidth: 1,
            fill: '#fff',
            refWidth: 1,
            refHeight: 1,
            rx: 4
        },
        typeTitle: {
            text: '类型',
            refX: 10,
            refY: 18,
            fill: '#000',
            fontSize: 14,
            'text-anchor': 'start',
        },
        nodeTitle: {
            text: '名称',
            refX: 60,
            refY: 18,
            fontSize: 14,
            fill: '#000',
            'text-anchor': 'start',
        },
        divider: {
            x1: 50,
            y1: 10,
            x2: 50,
            y2: 40,
            stroke: "#000",
            'stroke-dasharray': '4 2'
        }
    },
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        },
        {
            tagName: 'image',
            selector: 'image',
        },
        {
            tagName: 'text',
            selector: 'typeTitle',
        },
        {
            tagName: 'text',
            selector: 'nodeTitle',
        },
        {
            tagName: 'line',
            selector: 'divider',
        },
    ],
}