import { Button, Input, Space } from "antd";
import { useRef } from "react";
import { Link } from "react-router";
import { DataTableMethods } from "../../components/data-table/type";
import { FlowRecord } from "../../utils/type";
import { Apis } from "../../apis/apis";
import PopLinkDelete from "../../components/pop-link-delete";
import PageView from "../../components/page-view";
import DataTable from "../../components/data-table";

export default () => {
  const tableRef = useRef<DataTableMethods<FlowRecord>>(undefined);

  const columns = [
    { dataIndex: "Id", title: "ID" },
    { dataIndex: "FlowId", title: "工作流ID", renderForm: <Input /> },
    { dataIndex: "Version", title: "版本", renderForm: <Input /> },
    { dataIndex: "Input", title: "输入", renderForm: <Input /> },
    { dataIndex: "Output", title: "输出", renderForm: <Input /> },
    { dataIndex: "Context", title: "上下文", renderForm: <Input /> },
    { dataIndex: "StartTime", title: "开始时间", renderForm: <Input /> },
    { dataIndex: "EndTime", title: "结束时间", renderForm: <Input /> },
    { dataIndex: "RootId", title: "根ID", renderForm: <Input /> },
    { dataIndex: "ParentId", title: "父ID", renderForm: <Input /> },
    { dataIndex: "Status", title: "状态", renderForm: <Input /> },
    {
      title: "操作",
      render: (record: FlowRecord) => (
        <Space>
          <Link to={`/flow-record/${record.Id}`}>详情</Link>
          <PopLinkDelete id={record.Id} deleteApi={Apis.FlowRecord.Delete} callback={tableRef.current?.refreshData} />
        </Space>
      ),
    },
  ];

  return (
    <PageView
      title="执行记录"
      rightAction={
        <>
          <Button onClick={() => tableRef.current?.refreshData()}>刷新</Button>
        </>
      }
    >
      <DataTable request={Apis.FlowRecord.Describe} params={{ PageSize: 15 }} rowKey="Id" columns={columns} childRef={tableRef} />
    </PageView>
  );
};
