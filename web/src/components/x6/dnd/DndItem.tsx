import "./DndItem.less";
import React, { useState, useEffect, useRef } from "react";
import { Cell, Edge, Graph, Node, Point, Shape } from "@antv/x6";
import { GetVerticalEdge, IsNodeEdgeIntersect, IsRectIntersecting, IsRectLineIntersect } from "../../../utils/coordinate";
import { NodeTypeTitle } from "../../../utils/consts";

interface DndItemProps {
  graph: Graph;
  nodeType: string;
  onMouseUp: (cell: Cell, type: string) => void;
}

interface Position {
  x: number;
  y: number;
}

const DndItem: React.FC<DndItemProps> = ({ graph, nodeType, onMouseUp }) => {
  const originalDivRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [originalDivPosition, setOriginalDivPosition] = useState<Position>({ x: 0, y: 0 });
  const [draggedDiv, setDraggedDiv] = useState<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  // const [selectedEdge, setSelectedEdge] = useState<Edge<Edge.Properties> | null>(null);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setOriginalDivPosition({
      x: event.clientX,
      y: event.clientY,
    });
    setHeight(event.currentTarget.offsetHeight);
    setWidth(event.currentTarget.offsetWidth);

    const clonedDiv = document.createElement("div");
    clonedDiv.classList.add("draggable-node");
    clonedDiv.style.position = "absolute";
    clonedDiv.style.left = `${event.clientX - width / 2}px`;
    clonedDiv.style.top = `${event.clientY - height / 2}px`;
    clonedDiv.innerHTML = originalDivRef.current!.innerHTML;
    document.body.appendChild(clonedDiv);
    setDraggedDiv(clonedDiv);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging || !draggedDiv) return;
    draggedDiv.style.left = `${e.clientX - width / 2}px`;
    draggedDiv.style.top = `${e.clientY - height / 2}px`;
    const localP = graph.pageToLocal(e.pageX, e.pageY);
    if (selectedCell === null) {
      for (const cell of graph.getCells()) {
        if (isIntersect(localP, width, height, cell)) {
          selectCell(cell);
          break;
        }
      }
    } else {
      if (!isIntersect(localP, width, height, selectedCell)) {
        unSelectCell(selectedCell);
      }
    }
  };

  const isIntersect = (position: Point, width: number, height: number, cell: Cell) => {
    if (cell.isEdge()) {
      const edge = cell as Edge;
      return isIntersectEdge(position, width, height, edge);
    } else {
      const node = cell as Node;
      return isIntersectNode(position, width, height, node);
    }
  };

  const isIntersectEdge = (position: Point, width: number, height: number, edge: Edge) => {
    return IsRectLineIntersect({
      rectA: { x: position.x - width / 2, y: position.y - height / 2 },
      rectB: { x: position.x + width / 2, y: position.y - height / 2 },
      rectC: { x: position.x - width / 2, y: position.y + height / 2 },
      rectD: { x: position.x + width / 2, y: position.y + height / 2 },
      lineE: edge.getSourcePoint(),
      lineF: edge.getTargetPoint(),
    });
  };

  const isIntersectNode = (position: Point, width: number, height: number, node: Node) => {
    return IsRectIntersecting(
      { x: position.x - width / 2, y: position.y - height / 2, width: width, height: height },
      { x: node.getPosition().x, y: node.getPosition().y, width: node.getSize().width, height: node.getSize().height }
    );
  };

  const selectCell = (cell: Cell) => {
    setSelectedCell(cell);
    if (cell.isEdge()) {
      const edge = cell as Edge;
      selectEdge(edge);
    } else {
      const node = cell as Node;
      selectNode(node);
    }
  };

  const unSelectCell = (cell: Cell) => {
    if (cell.isEdge()) {
      const edge = cell as Edge;
      unSelectEdge(edge);
    } else {
      const node = cell as Node;
      unSelectNode(node);
    }
    setSelectedCell(null);
  };

  const selectEdge = (edge: Edge) => {
    edge.attr("line/stroke", "#22e");
    const { C, D } = GetVerticalEdge(edge.getSourcePoint(), edge.getTargetPoint(), 180);
    graph.addEdge({
      id: "selectedEdge",
      source: { x: C.x, y: C.y },
      target: { x: D.x, y: D.y },
      attrs: { line: { stroke: "#22e", strokeWidth: 4, strokeDasharray: "10 2", targetMarker: null } },
    });
  };

  const selectNode = (node: Node) => {
    node.setData({ activated: true });
  };

  const unSelectEdge = (edge: Edge) => {
    edge.attr("line/stroke", "#000");
    graph.removeEdge("selectedEdge");
  };

  const unSelectNode = (node: Node) => {
    node.setData({ activated: false });
  };

  const handleMouseUp = (e: MouseEvent) => {
    setDragging(false);
    if (draggedDiv) {
      document.body.removeChild(draggedDiv);
      setDraggedDiv(null);
      if (selectedCell) {
        unSelectCell(selectedCell);
        onMouseUp(selectedCell, nodeType);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="draggable-node" ref={originalDivRef} onMouseDown={handleMouseDown}>
      {NodeTypeTitle[nodeType]}
    </div>
  );
};

export default DndItem;
