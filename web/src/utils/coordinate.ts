
interface Point {
    x: number
    y: number
}

// 判断线段 AB 和 CD 是否相交
function isLineIntersect(A: Point, B: Point, C: Point, D: Point): boolean {
    // 计算向量 p1p2 和 p1p3 的叉积
    const cross = (a: Point, b: Point, c: Point): number =>
        (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    return cross(A, B, C) * cross(A, B, D) <= 0 && cross(C, D, A) * cross(C, D, B) <= 0;
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

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

// 判断矩形相交
export function IsRectIntersecting(r1: Rectangle, r2: Rectangle): boolean {
    return !(r1.x + r1.width < r2.x || r2.x + r2.width < r1.x ||
        r1.y + r1.height < r2.y || r2.y + r2.height < r1.y);
}

export function IsRectIntersecting2(r1: Rectangle, r2: Rectangle): boolean {
    // 将中心点坐标转换为左上角坐标
    const rect1Left = r1.x - r1.width / 2;
    const rect1Top = r1.y - r1.height / 2;
    const rect2Left = r2.x - r2.width / 2;
    const rect2Top = r2.y - r2.height / 2;
    return !(rect1Left + r1.width < rect2Left || rect2Left + r2.width < rect1Left ||
        rect1Top + r1.height < rect2Top || rect2Top + r2.height < rect1Top);
}

interface IsNodeEdgeIntersectProps {
    nodeCenter: Point
    nodeWidth: number
    nodeHeight: number
    edgeStart: Point
    edgeEnd: Point
}

// 判断流图中node和edge是否相交
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

// 获取垂直边的端点坐标
export function GetVerticalEdge(A: Point, B: Point, length: number): { C: Point, D: Point } {
    // 计算AB的方向向量
    const dx = B.x - A.x;
    const dy = B.y - A.y;

    // 垂直于AB的向量（未归一化）
    const perpVector1 = { x: -dy, y: dx };
    const perpVector2 = { x: dy, y: -dx };

    // 根据垂直向量计算C和D
    const factor = length / 2 / Math.sqrt(dx * dx + dy * dy);

    const C = {
        x: (A.x + B.x) / 2 + perpVector1.x * factor,
        y: (A.y + B.y) / 2 + perpVector1.y * factor
    };

    const D = {
        x: (A.x + B.x) / 2 + perpVector2.x * factor,
        y: (A.y + B.y) / 2 + perpVector2.y * factor
    };

    return { C, D };
}
