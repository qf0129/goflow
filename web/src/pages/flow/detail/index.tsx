import { Card, Descriptions } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Flow } from "../../../utils/type";
import { Apis } from "../../../apis/apis";
import PageView from "../../../components/page-view";
import VersionTable from "./version-table";

export default () => {
  const requested = useRef(false);
  const { id } = useParams();
  const [flow, setFlow] = useState<Flow>();

  const refreshData = () => {
    Apis.Flow.Describe({ Filter: { id: id } }).then((res) => {
      if (res.Code == 0) {
        setFlow(res.Data.List[0]);
      }
    });
  };
  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    refreshData();
    return () => {};
  }, []);

  return (
    <PageView breadcrumb={[{ title: "工作流", path: "/flow" }, { title: "详情" }]}>
      <Card title="基本信息">
        <Descriptions bordered={false} column={3}>
          <DescriptionsItem label="名称">{flow?.Name}</DescriptionsItem>
          <DescriptionsItem label="描述">{flow?.Description}</DescriptionsItem>
          <DescriptionsItem label="创建时间">{flow?.Ctime}</DescriptionsItem>
          <DescriptionsItem label="已发布版本">{flow?.PublishedVersion}</DescriptionsItem>
          <DescriptionsItem label="ID">{flow?.Id}</DescriptionsItem>
        </Descriptions>
      </Card>
      <VersionTable flowId={id} />
    </PageView>
  );
};
