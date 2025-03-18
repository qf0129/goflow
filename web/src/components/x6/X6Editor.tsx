import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { X6Core, X6CoreRef } from "./X6Core";
import { Edge, Node } from "@antv/x6";
import { BranchConfig, NodeConfig } from "../../utils/types";
import { Button, Card, MessagePlugin } from "tdesign-react";
import { readBranch } from "./common";
import { NodeForm } from "./NodeForm";
import { NodeTypeTitle } from "../../utils/consts";
import { DeleteIcon } from "tdesign-icons-react";

interface X6EditorProps {
  Branch: BranchConfig;
}
export interface X6EditorRef {
  onSave: () => void;
}

export const X6Editor = forwardRef<X6EditorRef, X6EditorProps>((props, ref) => {
  const [selectedNode, setSelectedNode] = useState<Node>();
  const [nodes, setNodes] = useState<Node.Metadata[]>([]);
  const [edges, setEdges] = useState<Edge.Metadata[]>([]);
  const core = useRef<X6CoreRef>(null);

  useImperativeHandle(ref, () => ({
    onSave: () => {
      // const branchConfig = toBranch(core.current?.nodes, core.current?.edges);
      // console.log(branchConfig);
      MessagePlugin.warning("暂不支持");
    },
  }));

  useEffect(() => {
    const { nodes, edges } = readBranch(props.Branch);
    setNodes(nodes);
    setEdges(edges);
    core.current?.refresh();
  }, [props.Branch]);

  const onSaveNode = ({ fields }: { fields: NodeConfig }) => {
    if (!fields.Id || !selectedNode) return;
    console.log(fields);
    selectedNode.setData(fields);
    core.current?.unSelectNode();
    core.current?.refresh();
    MessagePlugin.success("已更新");
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative", overflow: "hiden" }}>
      <X6Core
        ref={core}
        onSelectNode={(node) => {
          setSelectedNode(node);
        }}
        defaultEdges={edges}
        defaultNodes={nodes}
        showDndPanel
      />
      {selectedNode && (
        <Card
          title={NodeTypeTitle[selectedNode.data.Type as string] + " | " + selectedNode.data.Name}
          bordered={false}
          size="small"
          actions={<Button variant="text" theme="danger" icon={<DeleteIcon />} />}
          style={{
            width: "600px",
            maxHeight: "calc(100% - 40px)",
            overflow: "auto",
            position: "absolute",
            top: "20px",
            right: "20px",
          }}
        >
          <NodeForm nodeConfig={selectedNode.getData() as NodeConfig} onSave={onSaveNode} />
        </Card>
      )}
    </div>
  );
});
