import { Button, Card, Col, Form, Input, InputAdornment, Link, Row, Select, SelectValue, Space, Table, TableProps, TableRowData } from "tdesign-react";
import PageView from "../../components/PageView";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlowApi } from "../../apis/FlowApi";
import CreateFlowDialog from "./components/CreateFlowDialog";
import { CommonApi } from "../../apis/CommonApi";
import { OptionData } from "tdesign-react/es/common";

export default () => {
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const total = useRef(0);
  const pageSize = useRef(15);
  const pageNum = useRef(1);
  const navigate = useNavigate();
  const columns: TableProps["columns"] = [
    {
      colKey: "Name",
      title: "名称",
      cell: ({ row }) => (
        <Link theme="primary" onClick={() => navigate("/flow/" + row.Uid)}>
          {row.Name}
        </Link>
      ),
    },
    // { colKey: "Uid", title: "UID" },
    { colKey: "Description", title: "描述" },
    { colKey: "PublishedVersion", title: "已发布版本", width: 200 },
    { colKey: "Creator", title: "创建人", width: 180 },
    { colKey: "CreatedAt", title: "创建时间", width: 240, ellipsis: true },
    // {
    //   colKey: "action",
    //   width: 100,
    //   title: "操作",
    //   cell: ({ row }) => (
    //     <Link theme="primary" onClick={() => navigate("/flow/" + row.Uid)}>
    //       查看
    //     </Link>
    //   ),
    // },
  ];

  const flowName = useRef("");
  const [flowNameOptions, setFlowNameOptions] = useState<OptionData[]>([]);
  function requestFlowNames(words: string) {
    CommonApi.SearchCommon({ Type: "flow_name", Key: words }).then((resp) => {
      if (resp?.Data.SearchResults) {
        const res = resp.Data.SearchResults.map((item: any) => ({ label: item, value: item }));
        setFlowNameOptions(res);
      }
    });
  }

  function onChangeFlowName(val: SelectValue) {
    flowName.current = val as string;
    requestList();
  }

  function requestList() {
    let params: any = { Page: pageNum.current - 1, PageSize: pageSize.current };
    if (flowName.current) {
      params["Name"] = flowName.current;
    }
    FlowApi.DescribeFlows(params).then((resp) => {
      if (resp?.Data) {
        setTableData(resp.Data.List);
        total.current = resp.Data.Total;
      }
    });
  }

  useEffect(() => {
    requestList();
    requestFlowNames("");
  }, []);

  // function handleRowClick({ row }: { row: Flow }) {
  //   navigate("/flow/" + row.Uid);
  // }

  return (
    <PageView breadcrumbs={[{ content: "工作流管理", to: "/flow" }]}>
      <Card bordered={false}>
        <Row>
          <Col>
            <Select placeholder="工作流名称" clearable filterable value={flowName.current} options={flowNameOptions} onSearch={requestFlowNames} onChange={onChangeFlowName} />
          </Col>
          <Col flex={1} />
          <Col>
            <CreateFlowDialog onSubmit={requestList} />
          </Col>
        </Row>
        <Table
          style={{ marginTop: "10px" }}
          size="small"
          rowKey="Uid"
          columns={columns}
          data={tableData}
          pagination={{
            showPageSize: false,
            current: pageNum.current,
            pageSize: pageSize.current,
            total: total.current,
            onCurrentChange: (index: number) => {
              pageNum.current = index;
              requestList();
            },
            size: "small",
          }}
          tableLayout="fixed"
          verticalAlign="middle"
          hover
          // bordered
        />
      </Card>
    </PageView>
  );
};
