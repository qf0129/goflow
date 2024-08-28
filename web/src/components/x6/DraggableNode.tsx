import React, { useState, useEffect, useRef } from "react";
import { Edge, Graph } from "@antv/x6";
import "./DraggableNode.less"; // 假设这是你的 CSS 文件
import { IsNodeEdgeIntersect } from "../../utils/intersect";

interface DraggableNodeProps {
  children: React.ReactNode;
  graph: Graph;
  onMouseUp: (edge: Edge) => void;
}

interface Position {
  x: number;
  y: number;
}

// const DefaultHeight = 40;
// const DefaultWidth = 140;

const DraggableNode: React.FC<DraggableNodeProps> = ({ children, graph, onMouseUp }) => {
  const originalDivRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [originalDivPosition, setOriginalDivPosition] = useState<Position>({ x: 0, y: 0 });
  const [draggedDiv, setDraggedDiv] = useState<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [selectedEdge, setSelectedEdge] = useState<Edge<Edge.Properties> | null>(null);

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
    if (selectedEdge === null) {
      const intersectEdge = graph.getEdges().find((edge) =>
        IsNodeEdgeIntersect({
          nodeCenter: localP,
          nodeWidth: width,
          nodeHeight: height,
          edgeStart: edge.getSourcePoint(),
          edgeEnd: edge.getTargetPoint(),
        })
      );
      if (intersectEdge) {
        setSelectedEdge(intersectEdge);
        intersectEdge.setAttrs({ line: { stroke: "#33f" } });
      }
    } else {
      if (
        !IsNodeEdgeIntersect({
          nodeCenter: localP,
          nodeWidth: width,
          nodeHeight: height,
          edgeStart: selectedEdge.getSourcePoint(),
          edgeEnd: selectedEdge.getTargetPoint(),
        })
      ) {
        removeSelectedEdge();
      }
    }
  };

  const removeSelectedEdge = () => {
    if (selectedEdge) {
      selectedEdge.setAttrs({ line: { stroke: "#000" } });
      setSelectedEdge(null);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    setDragging(false);
    if (draggedDiv) {
      document.body.removeChild(draggedDiv);
      setDraggedDiv(null);
      if (selectedEdge) {
        onMouseUp(selectedEdge);
        removeSelectedEdge();
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
      {children}
    </div>
  );
};

export default DraggableNode;
