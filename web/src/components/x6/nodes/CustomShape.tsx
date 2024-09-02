import { Graph, Node } from "@antv/x6";
import { NodeTypeTitle } from "../../../utils/consts";

export default ({ node }: { node: Node; graph: Graph }) => {
  node.setSize({ width: 200, height: 50 });
  const label = node.getProp("label");
  const nodeType = node.getProp("nodeType");
  const { selected } = node.getData() || { selected: false };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "200px",
        height: "50px",
        border: selected ? "2px solid #22e" : "2px solid #000",
        cursor: "pointer",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ width: "50px", height: "30px", lineHeight: "30px", borderRight: "1px dashed #aaa", textAlign: "center" }}>{NodeTypeTitle[nodeType]}</div>
      <div style={{ flex: 1, padding: "0 10px" }}>{label || NodeTypeTitle[nodeType] + "节点"}</div>
    </div>
  );
};
