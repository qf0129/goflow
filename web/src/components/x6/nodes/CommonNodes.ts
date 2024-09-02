
export const StartNode = {
    width: 200,
    height: 30,
    attrs: {
        body: {
            fill: '#333',
            refWidth: 1,
            refHeight: 1,
            rx: 15
        },
        title: {
            text: '开始',
            refX: 85,
            refY: 9,
            fontSize: 14,
            fill: '#fff',
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

export const EndNode = {
    width: 200,
    height: 30,
    attrs: {
        body: {
            fill: '#333',
            refWidth: 1,
            refHeight: 1,
            rx: 15
        },
        title: {
            text: '结束',
            refX: 85,
            refY: 9,
            fontSize: 14,
            fill: '#fff',
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

export const EmptyNode = {
    width: 200,
    height: 50,
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
            refY: 18,
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