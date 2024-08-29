import { Graph, Node } from "@antv/x6";
import { FC } from "react";

interface EmptyNodeProps {
  node: Node;
  graph: Graph;
}

const EmptyNode: FC<EmptyNodeProps> = ({}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "200px", height: "50px", border: "2px dashed #000", backgroundColor: "#fff" }}>
      将节点拖至此处
    </div>
  );
};
export default EmptyNode;
