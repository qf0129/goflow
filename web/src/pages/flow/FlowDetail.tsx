import { Button, Card, Col, Descriptions, DialogPlugin, MessagePlugin, Row, Space } from "tdesign-react";
import PageView from "../../components/PageView";
import { useEffect, useRef, useState } from "react";
import { Flow } from "../../utils/types";
import { useNavigate, useParams } from "react-router-dom";
import FlowVersionTable, { FlowVersionTableRef } from "./components/FlowVersionTable";
import { FlowApi } from "../../apis/FlowApi";
import FlowExecutionTable, { FlowExecutionTableRef } from "./components/FlowExecutionTable";
import DescriptionsItem from "tdesign-react/es/descriptions/DescriptionsItem";
import { DeleteIcon, RefreshIcon } from "tdesign-icons-react";
import UpdateFlowDialog from "./components/UpdateFlowDialog";

export default () => {
  const [flow, setFlow] = useState<Flow>();
  const { id } = useParams();
  const executionTable = useRef<FlowExecutionTableRef>(null);
  const versionTable = useRef<FlowVersionTableRef>(null);
  const navigate = useNavigate();

  function requestData() {
    FlowApi.DescribeFlows({ Uids: [id || ""] }).then((resp) => {
      if (resp.Data && resp.Data.List.length > 0) {
        setFlow(resp.Data.List[0]);
      }
    });
  }

  function clickDelete() {
    const dialog = DialogPlugin.alert({
      header: "确认删除工作流吗",
      onConfirm: () => {
        FlowApi.DeleteFlow({ Uid: id as string }).then((resp) => {
          if (resp.Data) {
            navigate("/flow");
          } else {
            MessagePlugin.warning(resp.Error.Message);
          }
          dialog.destroy();
        });
      },
      onClose: () => {
        dialog.destroy();
      },
    });
  }

  useEffect(() => {
    requestData();
  }, []);

  return (
    <PageView breadcrumbs={[{ content: "工作流列表", href: "/flow" }, { content: flow?.Name || "" }]}>
      <Row gutter={[16, 16]}>
        <Col span={3}>
          <Card
            title="工作流信息"
            size="small"
            bordered={false}
            actions={
              <Space size="5px">
                <Button size="small" theme="danger" variant="text" icon={<DeleteIcon />} onClick={clickDelete} />
                <UpdateFlowDialog flow={flow || {}} onUpdate={requestData} />
              </Space>
            }
          >
            <Descriptions itemLayout="horizontal" layout="horizontal" column={1} labelStyle={{ width: "100px" }}>
              <DescriptionsItem label="Uid" span={1} content={flow?.Uid}></DescriptionsItem>
              <DescriptionsItem label="名称" span={1} content={flow?.Name}></DescriptionsItem>
              <DescriptionsItem label="描述" span={2} content={flow?.Description}></DescriptionsItem>
              <DescriptionsItem label="线上版本" span={1} content={flow?.PublishedVersion}></DescriptionsItem>
              <DescriptionsItem label="创建人" span={1} content={flow?.Creator}></DescriptionsItem>
              <DescriptionsItem label="创建时间" span={1} content={flow?.CreatedAt}></DescriptionsItem>
            </Descriptions>
          </Card>
        </Col>
        <Col span={9}>
          <Card
            title="版本列表"
            size="small"
            bordered={false}
            actions={[<Button key="refresh" variant="text" shape="circle" icon={<RefreshIcon />} onClick={versionTable.current?.requestList} />]}
          >
            <FlowVersionTable ref={versionTable} flowId={id || ""} onPublishVersion={requestData} />
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="执行记录"
            size="small"
            bordered={false}
            actions={[<Button key="refresh" variant="text" shape="circle" icon={<RefreshIcon />} onClick={executionTable.current?.requestList} />]}
          >
            <FlowExecutionTable ref={executionTable} FlowId={id || ""} ParentId="" detailBtn copyBtn />
          </Card>
        </Col>
      </Row>
    </PageView>
  );
};
