export const EmptyNode = {
    width: 200,
    height: 28,
    attrs: {
        body: {
            stroke: "#aaa",
            'stroke-dasharray': '8',
            fill: '#fff',
            refWidth: 1,
            refHeight: 1,
            rx: 4
        },
        title: {
            text: '将节点拖至此处',
            refX: 52,
            refY: 7,
            fontSize: 14,
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