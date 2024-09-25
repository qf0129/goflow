import { Card } from "tdesign-react";
import PageView from "../../components/PageView";
import { useEffect, useState } from "react";
import { Flow } from "../../utils/types";
import { useParams } from "react-router-dom";
import FlowVersionTable from "../../components/tables/FlowVersionTable";
import { Apis } from "../../apis/api";

export default () => {
  const [flow, setFlow] = useState<Flow>();
  const { id } = useParams();

  function requestData() {
    Apis.GetFlows({ Ids: [id || ""] }).then((resp) => {
      if (resp.Data && resp.Data.List.length > 0) {
        setFlow(resp.Data.List[0]);
      }
    });
  }

  useEffect(() => {
    requestData();
  }, []);

  return (
    <PageView title={"工作流: " + flow?.Name || ""}>
      <Card title="信息" size="small" bordered={false}>
        <div>{flow?.Name}</div>
      </Card>
      <Card title="版本" size="small" bordered={false}>
        <FlowVersionTable flowId={id || ""} />
      </Card>
      <Card title="执行历史" size="small" bordered={false}>
        <FlowVersionTable flowId={id || ""} />
      </Card>
    </PageView>
  );
};
