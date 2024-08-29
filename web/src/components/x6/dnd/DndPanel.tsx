import { Space } from "tdesign-react";
import DndItem from "./DndItem";
import { Cell, Graph } from "@antv/x6";

export default ({ graph, onMouseUp }: { graph: Graph; onMouseUp: (cell: Cell, type: string) => void }) => {
  return (
    <div className="x6-panel dnd-panel">
      <h3 style={{ lineHeight: "50px" }}>节点列表</h3>
      <Space direction="vertical" size={10}>
        <DndItem nodeType="job" graph={graph} onMouseUp={onMouseUp} />
        <DndItem nodeType="wait" graph={graph} onMouseUp={onMouseUp} />
        <DndItem nodeType="choice" graph={graph} onMouseUp={onMouseUp} />
      </Space>
    </div>
  );
};
