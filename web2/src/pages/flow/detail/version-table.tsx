import { Button, Card, Input, Space } from "antd";
import { Apis } from "../../../apis/apis";
import DataTable from "../../../components/data-table";
import { FlowVersion } from "../../../utils/type";
import PopLinkDelete from "../../../components/pop-link-delete";
import { DataTableMethods } from "../../../components/data-table/type";
import { useRef } from "react";
import NiceModal from "@ebay/nice-modal-react";
import modalCreate from "../../../components/modal-create";
import runFlowModal from "../../flow-execution/run-flow-modal";
import { Link, useNavigate } from "react-router";
import JsonLink from "../../../components/json-link";

export default ({ flowId }: { flowId: string | undefined }) => {
  const tableRef = useRef<DataTableMethods<FlowVersion>>(undefined);
  const nav = useNavigate();

  const columns = [
    { dataIndex: "Id", title: "ID" },
    { dataIndex: "Version", title: "版本号", renderForm: <Input /> },
    { title: "内容", render: (row: FlowVersion) => <JsonLink json={row?.Content} max={40} /> },
    { title: "输入模板", render: (row: FlowVersion) => <JsonLink json={row?.InputTemplate} max={40} /> },
    { dataIndex: "Published", title: "已发布" },
    {
      title: "操作",
      render: (row: FlowVersion) => (
        <Space>
          <Link
            to={""}
            onClick={() =>
              NiceModal.show(runFlowModal, {
                flowId: row.FlowId,
                versionId: row.Id,
                version: row.Version,
                onCreate: () => {
                  nav("/flow-execution");
                },
              })
            }
          >
            执行
          </Link>
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
      extra={
        <Space>
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
          </Button>
          <Button onClick={() => tableRef.current?.refreshData()}>刷新</Button>
        </Space>
      }
    >
      <DataTable request={Apis.FlowVersion.Describe} params={{ PageSize: 15, Filter: { flow_id: flowId } }} rowKey="Id" columns={columns} childRef={tableRef} />
    </Card>
  );
};
