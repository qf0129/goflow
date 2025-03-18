
export const GroupNode = {
    width: 300,
    height: 300,
    size: { width: 300, height: 300 },
    markup: [
        {
            selector: 'rootView',
            tagName: 'rect',
        },
        {
            selector: 'infoRect',
            tagName: 'rect',
        },
        {
            selector: 'infoLine',
            tagName: 'rect',
        },
        {
            selector: 'body',
            tagName: 'rect',
        },
        {
            selector: 'title',
            tagName: 'text',
        },
    ],
    attrs: {
        rootView: {
            refWidth: '100%',
            refHeight: '100%',
            fill: 'transparent',
        },
        body: {
            refWidth: '100%',
            refHeight: '100%',
            stroke: '#000',
            strokeWidth: 1,
            fill: 'transparent',
        },
        infoRect: {
            refWidth: '100%',
            height: 28,
            fill: '#fff',
        },
        infoLine: {
            refWidth: '100%',
            refY: 28,
            height: 1,
            fill: '#000',
        },
        title: {
            ref: 'infoRect',
            text: '名称',
            refX: '50%',
            refY: 7,
            fontSize: 14,
            fill: '#000',
            textAnchor: 'middle',
        },
    },
}