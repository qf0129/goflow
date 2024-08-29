import { Graph, Node } from "@antv/x6";

export default ({ node }: { node: Node; graph: Graph }) => {
  node.setSize({ width: 200, height: 30 });
  const label = node.getProp("label");
  return (
    <div
      style={{
        width: "200px",
        height: "30px",
        lineHeight: "30px",
        borderRadius: "15px",
        textAlign: "center",
        backgroundColor: "#444",
        color: "#fff",
      }}
    >
      {label}
    </div>
  );
};
