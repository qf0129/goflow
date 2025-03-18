import { Space } from "tdesign-react";
import DndItem from "./DndItem";
import { Cell, Graph } from "@antv/x6";

export default ({ graph, onMouseUp }: { graph: Graph | null; onMouseUp: (cell: Cell, type: string) => void }) => {
  const jobList = [
    ["job", "任务", "执行具体任务"],
    ["pass", "PASS", "可用作参数转换"],
    ["wait", "等待", "停止等待或者等待秒数"],
    ["choice", "选择", "分支选择"],
    ["foreach", "遍历", "遍历数据"],
    ["parallel", "并行", "并行执行"],
    ["notify", "通知", "发送knock通知"],
    ["subflow", "子流程", "嵌套子流程"],
  ];
  return (
    <div
      className="x6-panel dnd-panel"
      style={{
        borderRadius: "4px",
        position: "absolute",
        top: "20px",
        left: "20px",
        width: "160px",
        paddingBottom: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: 0.8,
        backgroundColor: "#fff",
        userSelect: "none",
      }}
    >
      <h3 style={{ lineHeight: "40px" }}>节点列表</h3>
      <Space direction="vertical" size={10}>
        {jobList.map((item) => (
          <DndItem key={item[0]} nodeType={item[0]} graph={graph as Graph} onMouseUp={onMouseUp} />
        ))}
      </Space>
    </div>
  );
};
