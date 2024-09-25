import { Button, MessagePlugin, Space, Tag } from "tdesign-react";
import PageView from "../../components/PageView";
import { useEffect, useRef, useState } from "react";
import { Flow, FlowVersion } from "../../utils/types";
import { useParams } from "react-router-dom";
import X6View from "../../components/x6/X6View";
import { Apis } from "../../apis/api";

export default () => {
  const [flow, setFlow] = useState<Flow>();
  const [flowversion, setFlowVersion] = useState<FlowVersion>();
  const { flowId, versionId } = useParams();
  const flowView = useRef<X6View>(null);

  function requestFlow() {
    if (!flowId) {
      MessagePlugin.warning("无效的id");
      return;
    }
    Apis.GetFlows({ Ids: [flowId] }).then((resp) => {
      if (resp.Data && resp.Data.List.length > 0) {
        setFlow(resp.Data.List[0]);
      }
    });
  }
  function requestFlowVersion() {
    if (!versionId) {
      MessagePlugin.warning("无效的版本id");
      return;
    }
    Apis.GetFlowVersions({ FlowId: flowId || "", Ids: [versionId] }).then((resp) => {
      if (resp.Data && resp.Data.List.length > 0) {
        setFlowVersion(resp.Data.List[0]);
      }
    });
  }

  const onSaveFlow = () => {
    flowView.current && flowView.current.ExportJson();
  };

  useEffect(() => {
    requestFlow();
    requestFlowVersion();
  }, []);

  return (
    <PageView
      title={"编辑: " + flow?.Name || ""}
      action={
        <Space>
          <Tag>版本号: {flowversion?.Version}</Tag>
          <Button onClick={onSaveFlow}>保存</Button>
        </Space>
      }
    >
      <X6View ref={flowView} />
    </PageView>
  );
};
