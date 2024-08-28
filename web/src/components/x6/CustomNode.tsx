import { Graph, Node } from "@antv/x6";
import { FC } from "react";
import { NodeTypeTitle } from "../../utils/consts";

interface CustomNodeProps {
  node: Node;
  graph: Graph;
}

const CustomNode: FC<CustomNodeProps> = ({ node }) => {
  const label = node.getProp("label");
  const nodeType = node.getProp("nodeType");

  return (
    <div style={{ display: "flex", alignItems: "center", width: "200px", height: "50px", border: "2px solid #000", backgroundColor: "#fff" }}>
      <div style={{ width: "50px", height: "30px", lineHeight: "30px", borderRight: "1px dashed #aaa", textAlign: "center" }}>{NodeTypeTitle[nodeType]}</div>
      <div style={{ flex: 1, padding: "0 10px" }}>{label}</div>
    </div>
  );
};

export default CustomNode;
