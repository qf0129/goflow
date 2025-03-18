
export const LabelNode = {
    width: 200,
    height: 28,
    attrs: {
        body: {
            fill: '#333',
            refWidth: 1,
            refHeight: 1,
            rx: 15
        },
        title: {
            text: 'Label',
            refX: "50%",
            refY: 7,
            fontSize: 14,
            fill: '#fff',
            textAnchor: 'middle',
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
