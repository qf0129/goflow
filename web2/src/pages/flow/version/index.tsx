import { Card, Descriptions } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { FlowVersion } from "../../../utils/type";
import { Apis } from "../../../apis/apis";
import PageView from "../../../components/page-view";

export default () => {
  const requested = useRef(false);
  const { vid } = useParams();
  const [version, setVersion] = useState<FlowVersion>();

  const refreshData = () => {
    Apis.FlowVersion.Describe({ Filter: { id: vid } }).then((res) => {
      if (res.Code == 0) {
        setVersion(res.Data.List[0]);
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
    <PageView breadcrumb={[{ title: "工作流", path: "/flow" }, { title: "详情", path: version?.FlowId }, { title: "编辑版本" }]}>
      <Card title="版本信息">
        <Descriptions bordered={false} column={3}>
          <DescriptionsItem label="版本号">{version?.Version}</DescriptionsItem>
        </Descriptions>
      </Card>
    </PageView>
  );
};
