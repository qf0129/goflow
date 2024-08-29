import { Graph, Node } from "@antv/x6";

export default ({ node }: { node: Node; graph: Graph }) => {
  node.setSize({ width: 200, height: 50 });
  const { activated } = node.getData() || { activated: false };
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "200px", height: "50px", border: "2px dashed #000", backgroundColor: "#fff" }}>
      将节点拖至此处
      {/* {activated && <span>Act</span>} */}
    </div>
  );
};
