
interface Point {
    x: number
    y: number
}

// 计算向量 p1p2 和 p1p3 的叉积
function crossProduct(p1: Point, p2: Point, p3: Point) {
    return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
}

// 判断三点 A, B, C 是否按逆时针顺序排列
function ccw(A: Point, B: Point, C: Point) {
    return crossProduct(A, B, C) > 0;
}

// 判断线段 AB 和 CD 是否相交
export function isLineIntersect(A: Point, B: Point, C: Point, D: Point) {
    return ccw(A, C, D) !== ccw(B, C, D) && ccw(A, B, C) !== ccw(A, B, D);
}

interface intersectProps {
    rectA: Point
    rectB: Point
    rectC: Point
    rectD: Point
    lineE: Point
    lineF: Point
}
// 判断矩形 ABCD 和 线段EF 是否相交
export function IsRectLineIntersect(p: intersectProps) {
    return isLineIntersect(p.rectA, p.rectB, p.lineE, p.lineF) ||
        isLineIntersect(p.rectA, p.rectC, p.lineE, p.lineF) ||
        isLineIntersect(p.rectB, p.rectC, p.lineE, p.lineF) ||
        isLineIntersect(p.rectC, p.rectD, p.lineE, p.lineF)
}

interface IsNodeEdgeIntersectProps {
    nodeCenter: Point
    nodeWidth: number
    nodeHeight: number
    edgeStart: Point
    edgeEnd: Point
}
export function IsNodeEdgeIntersect(p: IsNodeEdgeIntersectProps) {
    return IsRectLineIntersect({
        rectA: { x: p.nodeCenter.x - p.nodeWidth / 2, y: p.nodeCenter.y - p.nodeHeight / 2 },
        rectB: { x: p.nodeCenter.x + p.nodeWidth / 2, y: p.nodeCenter.y - p.nodeHeight / 2 },
        rectC: { x: p.nodeCenter.x - p.nodeWidth / 2, y: p.nodeCenter.y + p.nodeHeight / 2 },
        rectD: { x: p.nodeCenter.x + p.nodeWidth / 2, y: p.nodeCenter.y + p.nodeHeight / 2 },
        lineE: p.edgeStart,
        lineF: p.edgeEnd,
    })
}
