import { Link, Popup, Space, Table, TableProps, TableRowData, Tag } from "tdesign-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FlowApi, DescribeFlowStepsProps } from "../../../apis/FlowApi";
import { GetUseTimeString } from "../../../utils/time";
import { ShowJsonDialog } from "../../../utils/dialog";
import { CaretRightIcon, CaretRightSmallIcon } from "tdesign-icons-react";
import FlowExecutionTable from "./FlowExecutionTable";
import EmptyView from "../../../components/EmptyView";
import UpdateStepDialog from "./UpdateStepDialog";
import { FlowStep } from "../../../utils/types";
import { FlowStatusTheme, FlowStatusTitle, NodeTypeTitle } from "../../../utils/consts";
import FlowExecutionTableMini from "./FlowExecutionTableMini";

export interface FlowStepTableRef {
  requestList: () => void;
}

const FlowStepTable = forwardRef<FlowStepTableRef, DescribeFlowStepsProps>((props, ref) => {
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const total = useRef(0);
  const pageSize = useRef(props.PageSize || 10);
  const pageNum = useRef(1);
  const currentInterval = useRef(0);

  const columns: TableProps["columns"] = [
    // { colKey: "Uid", title: "步骤UID", ellipsis: true },
    // { colKey: "RootExecutionId", title: "根执行记录id", ellipsis: true },
    // { colKey: "ExecutionId", title: "执行记录id", ellipsis: true },
    { colKey: "NodeType", title: "节点类型", width: 80, cell: ({ row }) => <span>{NodeTypeTitle[row.NodeType]}</span> },
    { colKey: "CreatedAt", title: "创建时间", width: 160, ellipsis: true },
    // {
    //   colKey: "Input",
    //   title: "输入",
    //   ellipsis: ({ row }) => <span>{JSON.stringify(row.Input)}</span>,
    //   cell: ({ row }) => row.Input && <Link onClick={() => ShowJsonDialog("输入", row.Input)}>{JSON.stringify(row.Input)}</Link>,
    // },
    // {
    //   colKey: "Output",
    //   title: "输出",
    //   ellipsis: ({ row }) => <span>{JSON.stringify(row.Output, null, 2)}</span>,
    //   cell: ({ row }) => row.Output && <Link onClick={() => ShowJsonDialog("输出", row.Output)}>{JSON.stringify(row.Output)}</Link>,
    // },
    // { colKey: "NodeId", title: "节点Id", ellipsis: true },
    // { colKey: "NextNodeId", title: "下一节点Id", ellipsis: true },
    // { colKey: "ResourceId", title: "资源ID", ellipsis: true },
    {
      colKey: "UseTime",
      title: "耗时",
      width: 100,
      cell: ({ row }) => (
        <Popup trigger="hover" showArrow content={new Date(row.StartTime).toLocaleString() + " 至 " + new Date(row.EndTime).toLocaleString()}>
          <span>{GetUseTimeString(row.StartTime, row.EndTime)}</span>
        </Popup>
      ),
    },
    {
      colKey: "Status",
      title: "状态",
      width: 100,
      cell: ({ row }) => (
        <Tag variant="light" theme={FlowStatusTheme[row.Status]}>
          {FlowStatusTitle[row.Status]}
        </Tag>
      ),
    },
    {
      colKey: "operation",
      title: "操作",
      width: 100,
      fixed: "right",
      cell: ({ row }) => (
        <Space>
          <UpdateStepDialog step={row as FlowStep} onUpdate={requestList} />
        </Space>
      ),
    },
  ];

  function requestList() {
    FlowApi.DescribeFlowSteps({ Page: pageNum.current - 1, PageSize: props.PageSize || 10, OrderBy: "id asc", ...props }).then((resp) => {
      if (resp.Data) {
        setTableData(resp.Data.List);
        total.current = resp.Data.Total;
      }
    });
  }

  const expandedRow: TableProps["expandedRow"] = ({ row }) => <FlowExecutionTableMini parentStepId={row.Uid} />;
  const expandIcon: TableRowData["expandIcon"] = ({ row }: { row: FlowStep }) => {
    if (["foreach", "parallel", "subflow"].includes(row.NodeType as string)) {
      return <CaretRightSmallIcon color="#0052d9" />;
    }
    return false;
  };

  const rehandleExpandChange: TableProps["onExpandChange"] = (value, _) => {
    setExpandedRowKeys(value as string[]);
  };

  useImperativeHandle(ref, () => ({
    requestList,
  }));

  useEffect(() => {
    requestList();
    const interval = setInterval(() => {
      requestList();
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [props.NodeId]);

  if (tableData.length == 0) {
    return <EmptyView />;
  } else {
    return (
      <Table
        rowKey="Uid"
        size="small"
        columns={columns}
        data={tableData}
        pagination={
          total.current > pageSize.current
            ? {
                showPageSize: false,
                current: pageNum.current,
                total: total.current,
                onCurrentChange: (index: number) => {
                  pageNum.current = index;
                  requestList();
                },
                size: "small",
              }
            : undefined
        }
        // tableLayout="fixed"
        // verticalAlign="middle"
        // hover
        bordered
        expandedRowKeys={expandedRowKeys}
        expandedRow={expandedRow}
        onExpandChange={rehandleExpandChange}
        // expandOnRowClick={true}
        expandIcon={expandIcon}
        style={{ backgroundColor: "#eee" }}
      ></Table>
    );
  }
});
export default FlowStepTable;
