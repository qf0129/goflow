import { Button, Input, Space } from "antd";
import NiceModal from "@ebay/nice-modal-react";
import { useRef } from "react";
import { Link } from "react-router";
import { DataTableMethods } from "../../components/data-table/type";
import { Flow } from "../../utils/type";
import { Apis } from "../../apis/apis";
import PopLinkDelete from "../../components/pop-link-delete";
import PageView from "../../components/page-view";
import DataTable from "../../components/data-table";
import ModalCreate from "../../components/modal-create";

export default () => {
  const tableRef = useRef<DataTableMethods<Flow>>(undefined);

  const columns = [
    { dataIndex: "Id", title: "ID" },
    { dataIndex: "Name", title: "名称", renderForm: <Input /> },
    { dataIndex: "Description", title: "描述", renderForm: <Input /> },
    { dataIndex: "PublishedVersionId", title: "已发布版本ID", renderForm: <Input /> },
    { dataIndex: "PublishedVersion", title: "已发布版本", renderForm: <Input /> },
    {
      title: "操作",
      render: (row: Flow) => (
        <Space>
          <Link to={`/flow/${row.Id}`}>详情</Link>
          <PopLinkDelete id={row.Id} deleteApi={Apis.Flow.Delete} callback={tableRef.current?.refreshData} />
        </Space>
      ),
    },
  ];

  return (
    <PageView
      title="工作流"
      rightAction={
        <>
          <Button
            type="primary"
            onClick={() =>
              NiceModal.show(ModalCreate, {
                title: "新建工作流",
                columns: columns,
                createApi: Apis.Flow.Create,
                onCreate: tableRef.current?.refreshData,
              })
            }
          >
            新建工作流
          </Button>
          <Button onClick={() => tableRef.current?.refreshData()}>刷新</Button>
        </>
      }
    >
      <DataTable request={Apis.Flow.Describe} params={{ PageSize: 15 }} rowKey="Id" columns={columns} childRef={tableRef} />
    </PageView>
  );
};
