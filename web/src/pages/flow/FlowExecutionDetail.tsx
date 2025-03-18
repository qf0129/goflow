import { Button, Card, Col, MessagePlugin, Popconfirm, Row, Space, Tabs, Tag } from "tdesign-react";
import PageView from "../../components/PageView";
import { useEffect, useRef, useState } from "react";
import { BranchConfig, Flow, FlowExecution, FlowStep, FlowVersion, NodeConfig } from "../../utils/types";
import { useParams } from "react-router-dom";
import { FlowApi } from "../../apis/FlowApi";
import FlowStepTable, { FlowStepTableRef } from "./components/FlowStepTable";
import { RefreshIcon } from "tdesign-icons-react";
import { X6Core, X6CoreRef } from "../../components/x6/X6Core";
import { readBranch } from "../../components/x6/common";
import { Edge, Node } from "@antv/x6";
import FlowExecutionTableMini, { FlowExecutionTableMiniRef } from "./components/FlowExecutionTableMini";
import { FlowStatusTheme, FlowStatusTitle, NodeTypeTitle } from "../../utils/consts";
import TabPanel from "tdesign-react/es/tabs/TabPanel";
import { NodeForm } from "../../components/x6/NodeForm";

export default () => {
  // const [flow, setFlow] = useState<Flow>();
  // const [version, setFlowVersion] = useState<FlowVersion>();
  const [execution, setExecution] = useState<FlowExecution>();
  const flow = useRef<Flow | undefined>();
  const version = useRef<FlowVersion>();
  const { id: executionId } = useParams();
  const stepTable = useRef<FlowStepTableRef>(null);
  const executionTable = useRef<FlowExecutionTableMiniRef>(null);
  const [steps, setSteps] = useState<Array<FlowStep>>();
  const [selectedNode, setSelectedNode] = useState<Node>();
  const [nodes, setNodes] = useState<Node.Metadata[]>([]);
  const [edges, setEdges] = useState<Edge.Metadata[]>([]);
  const core = useRef<X6CoreRef>(null);

  function requestFlowExecution() {
    if (!executionId) {
      MessagePlugin.warning("无效的执行记录id");
      return;
    }
    FlowApi.DescribeFlowExecutions({ Uids: [executionId] }).then((resp) => {
      if (resp.Data && resp.Data.List.length > 0) {
        setExecution(resp.Data.List[0]);
        if (!flow.current) {
          requestFlow(resp.Data.List[0]?.FlowId as string);
        }
        if (!version.current) {
          requestFlowVersion(resp.Data.List[0]?.FlowVersionId as string);
        }
      }
    });
  }

  function requestFlow(flowId: string) {
    if (!flowId) {
      MessagePlugin.warning("无效的id");
      return;
    }
    FlowApi.DescribeFlows({ Uids: [flowId] }).then((resp) => {
      if (resp.Data && resp.Data.List.length > 0) {
        // setFlow(resp.Data.List[0]);
        flow.current = resp.Data.List[0];
      }
    });
  }
  function requestFlowVersion(versionId: string) {
    if (!versionId) {
      MessagePlugin.warning("无效的版本id");
      return;
    }
    FlowApi.DescribeFlowVersions({ Uids: [versionId] }).then((resp) => {
      if (resp.Data && resp.Data.List.length > 0) {
        // setFlowVersion(resp.Data.List[0]);
        version.current = resp.Data.List[0];
        const { nodes, edges } = readBranch(version.current?.Content as BranchConfig);
        setNodes(nodes);
        setEdges(edges);
        core.current?.refresh();
      }
    });
  }
  function requestFlowSteps() {
    FlowApi.DescribeFlowSteps({ RootFlowExecutionId: executionId, SelectFields: ["node_id", "status"], PageSize: 1000 }).then((resp) => {
      if (resp.Data && resp.Data.List.length > 0) {
        setSteps(resp.Data.List);
      }
    });
  }

  function requestRetry() {
    FlowApi.RetryFlowExecution({ Uid: executionId as string }).then((resp) => {
      if (resp.Data) {
        requestFlowExecution();
        MessagePlugin.success("开始重试");
      } else {
        MessagePlugin.error(resp.Error.Message);
      }
    });
  }
  function requestCancel() {
    FlowApi.CancelFlowExecution({ Uid: executionId as string }).then((resp) => {
      if (resp.Data) {
        requestFlowExecution();
        MessagePlugin.success("已取消");
      } else {
        MessagePlugin.error(resp.Error.Message);
      }
    });
  }

  useEffect(() => {
    requestFlowSteps();
    requestFlowExecution();
    const interval1 = setInterval(() => {
      requestFlowExecution();
    }, 5000);
    const interval2 = setInterval(() => {
      requestFlowSteps();
    }, 3000);
    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  return (
    <PageView
      breadcrumbs={[{ content: "工作流列表", href: "/flow" }, { content: flow.current?.Name || "", href: "/flow/" + flow.current?.Uid }, { content: "执行记录" }]}
      // titleAfter={<Tag>版本: {flowversion?.Version}</Tag>}
      action={
        <Space align="center">
          {/* <Button theme="primary">执行</Button> */}
          <Tag theme={FlowStatusTheme[execution?.Status as string]} variant="light" size="large">
            {FlowStatusTitle[execution?.Status as string]}
          </Tag>
          <Popconfirm
            content="确认重试吗"
            destroyOnClose
            placement="top"
            showArrow
            theme="warning"
            onConfirm={() => {
              requestRetry();
            }}
          >
            <Button theme="warning">重试</Button>
          </Popconfirm>
          <Popconfirm
            content="确认取消吗"
            destroyOnClose
            placement="top"
            showArrow
            theme="warning"
            onConfirm={() => {
              requestCancel();
            }}
          >
            <Button theme="default">取消</Button>
          </Popconfirm>
        </Space>
      }
    >
      <Row style={{ height: "100%" }}>
        <Col span={6} style={{ height: "100%" }}>
          {version.current && <X6Core ref={core} onSelectNode={(node) => setSelectedNode(node)} defaultEdges={edges} defaultNodes={nodes} steps={steps} />}
        </Col>
        <Col span={6} style={{ height: "100%", overflow: "auto" }}>
          {selectedNode ? (
            <Card
              title={NodeTypeTitle[selectedNode.data.Type as string] + " | " + selectedNode.data.Name}
              size="small"
              bordered={false}
              actions={<Button key="refresh" variant="text" shape="circle" icon={<RefreshIcon />} onClick={stepTable.current?.requestList} />}
            >
              <Tabs>
                <TabPanel label="所有步骤" value={1}>
                  <br />
                  <FlowStepTable ref={stepTable} RootFlowExecutionId={executionId as string} NodeId={selectedNode.id} />
                </TabPanel>
                <TabPanel label="节点配置" value={2}>
                  <NodeForm nodeConfig={selectedNode.data as NodeConfig} disabled />
                </TabPanel>
              </Tabs>
            </Card>
          ) : (
            <Card
              title="执行记录"
              size="small"
              bordered={false}
              actions={[<Button key="refresh" variant="text" shape="circle" icon={<RefreshIcon />} onClick={executionTable.current?.requestList} />]}
            >
              <FlowExecutionTableMini ref={executionTable} uid={executionId as string} />
            </Card>
          )}
        </Col>
      </Row>
    </PageView>
  );
};
