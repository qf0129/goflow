import { FC, useEffect, useRef, useState } from "react";
import { X6Core, X6CoreRef } from "./X6Core";
import { Edge, Node } from "@antv/x6";
import { BranchConfig, FlowExecution, FlowVersion, NodeConfig } from "../../utils/types";
import { readBranch } from "./common";
import { NodeViewer } from "./NodeViewer";
import { Button, Card, Col, Row } from "tdesign-react";
import FlowExecutionTable from "../../pages/flow/components/FlowExecutionTable";
import { RefreshIcon } from "tdesign-icons-react";

interface X6ViewerProps {
  execution?: FlowExecution;
  version?: FlowVersion;
  // Branch: BranchConfig;
}

export const X6Viewer: FC<X6ViewerProps> = (props) => {
  const [selectedNode, setSelectedNode] = useState<Node>();
  const [nodes, setNodes] = useState<Node.Metadata[]>([]);
  const [edges, setEdges] = useState<Edge.Metadata[]>([]);
  const core = useRef<X6CoreRef>(null);

  useEffect(() => {
    const { nodes, edges } = readBranch(props.version?.Content as BranchConfig);
    setNodes(nodes);
    setEdges(edges);
    core.current?.refresh();
  }, [props.version?.Content]);

  return (
    <Row style={{ height: "100%" }}>
      <Col span={6} style={{ height: "100%" }}>
        <X6Core ref={core} onSelectNode={(node) => setSelectedNode(node)} defaultEdges={edges} defaultNodes={nodes} />
      </Col>
      <Col span={6} style={{ height: "100%" }}>
        <Card size="small" bordered={false} actions={[<Button key="refresh" variant="text" shape="circle" icon={<RefreshIcon />} />]}>
          <FlowExecutionTable Uids={[props.execution?.Uid || ""]} OrderBy="id asc" showExpand updateBtn />
          {/* <FlowStepTable ref={stepTable} FlowExecutionId={id || ""} PageSize={50} /> */}
        </Card>
      </Col>
    </Row>
  );
};
