import { MessagePlugin, Tag } from "tdesign-react";
import PageView from "../../components/PageView";
import { useEffect, useState } from "react";
import { ApiQueryFlow, ApiQueryFlowVersion } from "../../apis/flow";
import { Flow, FlowVersion } from "../../utils/types";
import { useParams } from "react-router-dom";
import X6View from "../../components/x6/X6View";

export default () => {
  const [flow, setFlow] = useState<Flow>();
  const [flowversion, setFlowVersion] = useState<FlowVersion>();
  const { flowId, versionId } = useParams();

  function requestFlow() {
    if (!flowId) {
      MessagePlugin.warning("无效的id");
      return;
    }
    ApiQueryFlow({ Id: flowId }).then((resp) => {
      if (resp.code == 0 && resp.data.list.length > 0) {
        setFlow(resp.data.list[0]);
      }
    });
  }
  function requestFlowVersion() {
    if (!versionId) {
      MessagePlugin.warning("无效的版本id");
      return;
    }
    ApiQueryFlowVersion(versionId).then((resp) => {
      if (resp.code == 0) {
        setFlowVersion(resp.data);
      }
    });
  }

  useEffect(() => {
    requestFlow();
    requestFlowVersion();
  }, []);

  return (
    <PageView title={"编辑: " + flow?.Name || ""} action={<Tag>版本号: {flowversion?.Version}</Tag>}>
      <X6View />
    </PageView>
  );
};
