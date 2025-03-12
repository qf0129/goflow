import { Button, Card, Input, Space } from "antd";
import { Apis } from "../../../apis/apis";
import DataTable from "../../../components/data-table";
import { FlowVersion } from "../../../utils/type";
import { Link } from "react-router";
import PopLinkDelete from "../../../components/pop-link-delete";
import { DataTableMethods } from "../../../components/data-table/type";
import { useRef } from "react";
import NiceModal from "@ebay/nice-modal-react";
import modalCreate from "../../../components/modal-create";

export default ({ flowId }: { flowId: string | undefined }) => {
  const tableRef = useRef<DataTableMethods<FlowVersion>>(undefined);

  const columns = [
    { dataIndex: "Id", title: "ID" },
    { dataIndex: "Version", title: "版本号", renderForm: <Input /> },
    { dataIndex: "Content", title: "内容" },
    { dataIndex: "InputTemplate", title: "输入模板" },
    { dataIndex: "Published", title: "已发布" },
    {
      title: "操作",
      render: (row: FlowVersion) => (
        <Space>
          <Link to={`version/${row.Id}`}>编辑</Link>
          <PopLinkDelete id={row.Id} deleteApi={Apis.FlowVersion.Delete} callback={tableRef.current?.refreshData} />
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="所有版本"
      style={{ marginTop: 16 }}
      extra={[
        <Button
          type="primary"
          onClick={() =>
            NiceModal.show(modalCreate, {
              title: "新建版本",
              columns: columns,
              createApi: Apis.FlowVersion.Create,
              onCreate: tableRef.current?.refreshData,
              extraProps: { FlowId: flowId },
            })
          }
        >
          新建版本
        </Button>,
      ]}
    >
      <DataTable request={Apis.FlowVersion.Describe} params={{ PageSize: 15, Filter: { flow_id: flowId } }} rowKey="Id" columns={columns} childRef={tableRef} />
    </Card>
  );
};
