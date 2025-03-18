
export const CustomNode = {
    width: 200,
    height: 28,
    attrs: {
        body: {
            // stroke: '#5F95FF',
            stroke: '#000',
            strokeWidth: 1,
            fill: '#fff',
            refWidth: 1,
            refHeight: 1,
            rx: 5
        },
        title: {
            text: '名称',
            refX: "50%",
            refY: 7,
            fontSize: 14,
            fill: '#000',
            'text-anchor': 'middle',
        },
    },
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        },
        {
            tagName: 'text',
            selector: 'title',
        },
    ],
}