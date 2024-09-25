import { Button, PrimaryTable } from "tdesign-react";
import PageView from "../../components/PageView";
import { useEffect, useState } from "react";
import { Flow } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { Apis } from "../../apis/api";

export default () => {
  const [tableData, setTableData] = useState<Flow[]>([]);
  const columns = [
    { colKey: "Name", title: "名称" },
    { colKey: "Desc", title: "描述", width: 160 },
    { colKey: "CreateTime", title: "创建时间", width: 240, ellipsis: true },
  ];
  function requestList() {
    Apis.GetFlows().then((resp) => {
      if (resp.Data) {
        console.log(resp.Data);
        setTableData(resp.Data.List);
      }
    });
  }

  useEffect(() => {
    requestList();
  }, []);

  const navigate = useNavigate();
  function handleRowClick({ row }: { row: Flow }) {
    navigate("/flow/" + row.Uid);
  }

  return (
    <PageView title="FlowList" hideBack action={<Button>新建工作流</Button>}>
      <PrimaryTable
        rowKey="Uid"
        columns={columns}
        data={tableData}
        pagination={{ defaultPageSize: 10, total: 30 }}
        size="medium"
        tableLayout="fixed"
        verticalAlign="middle"
        hover
        onRowClick={handleRowClick}
      />
    </PageView>
  );
};
