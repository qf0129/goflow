import { Button, MessagePlugin, Space, Tag } from "tdesign-react";
import PageView from "../../components/PageView";
import { useEffect, useRef, useState } from "react";
import { BranchConfig, Flow, FlowVersion } from "../../utils/types";
import { useParams } from "react-router-dom";
import { FlowApi } from "../../apis/FlowApi";
import { X6Editor, X6EditorRef } from "../../components/x6/X6Editor";

export default () => {
  const [flow, setFlow] = useState<Flow>();
  const [flowVersion, setFlowVersion] = useState<FlowVersion>();
  const { id } = useParams();
  const X6EditorRef = useRef<X6EditorRef>(null);

  function requestFlowVersion() {
    if (!id) {
      MessagePlugin.warning("无效的版本id");
      return;
    }
    FlowApi.DescribeFlowVersions({ Uids: [id] }).then((resp) => {
      if (resp.Data && resp.Data.List.length > 0) {
        setFlowVersion(resp.Data.List[0]);
        requestFlow(resp.Data.List[0]?.FlowId as string);
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
        setFlow(resp.Data.List[0]);
      }
    });
  }

  useEffect(() => {
    requestFlowVersion();
  }, []);

  return (
    <PageView
      breadcrumbs={[{ content: "工作流列表", href: "/flow" }, { content: flow?.Name || "", href: "/flow/" + flow?.Uid }, { content: "编辑工作流" }]}
      titleAfter={
        <Space>
          <Tag theme="success" variant="outline" size="small">
            版本: {flowVersion?.Version}
          </Tag>
          {flowVersion?.Published && (
            <Tag theme="primary" variant="light-outline" size="small">
              已发布
            </Tag>
          )}
        </Space>
      }
      action={
        <Space>
          <Button onClick={X6EditorRef.current?.onSave}>保存</Button>
        </Space>
      }
    >
      <X6Editor ref={X6EditorRef} Branch={flowVersion?.Content as BranchConfig} />
    </PageView>
  );
};
