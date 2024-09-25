import { Space, Table, TableProps, TableRowData } from "tdesign-react";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Apis } from "../../apis/api";

interface FlowVersionTableProps {
  flowId: string;
}

const FlowVersionTable: FC<FlowVersionTableProps> = ({ flowId }) => {
  const [tableData, setTableData] = useState<TableRowData[]>([]);

  const columns: TableProps["columns"] = [
    { colKey: "Version", title: "版本", width: 200 },
    { colKey: "Content", title: "内容", width: 200, ellipsis: true },
    { colKey: "CreateTime", title: "创建时间", width: 200, ellipsis: true },
    { colKey: "customPublished", title: "已发布", width: 200 },
    {
      colKey: "action",
      title: "操作",
      width: 200,
      cell: ({ row }) => (
        <Space>
          <Link to={"/flow/" + flowId + "/version/" + row.Id + "/edit"}>编辑</Link>
        </Space>
      ),
    },
  ];

  function requestList() {
    Apis.GetFlowVersions({ FlowId: flowId }).then((resp) => {
      if (resp.Data) {
        setTableData(resp.Data.List);
      }
    });
  }

  useEffect(() => {
    if (!flowId) return;
    requestList();
  }, []);

  // const navigate = useNavigate()
  return (
    <Table
      rowKey="Id"
      columns={columns}
      data={tableData}
      pagination={{ defaultPageSize: 10, total: 30 }}
      size="medium"
      tableLayout="fixed"
      verticalAlign="middle"
      hover
      stripe
    ></Table>
  );
};
export default FlowVersionTable;
