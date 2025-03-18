import { Link, Popup, Space, Table, TableProps, TableRowData, Tag } from "tdesign-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FlowApi, DescribeFlowExecutionsProps } from "../../../apis/FlowApi";
import { useNavigate } from "react-router-dom";
import { GetUseTimeString } from "../../../utils/time";
import { ShowJsonDialog } from "../../../utils/dialog";
import EmptyView from "../../../components/EmptyView";
import { ChevronRightIcon } from "tdesign-icons-react";
import FlowStepTable from "./FlowStepTable";
import { FlowStatusTheme, FlowStatusTitle } from "../../../utils/consts";
import UpdateExecutionDialog from "./UpdateExecutionDialog";
import { FlowExecution } from "../../../utils/types";
import RunFlowVersionDialog from "./RunFlowVersionDialog";
import NiceModal from "@ebay/nice-modal-react";

export interface FlowExecutionTableRef {
  requestList: () => void;
}

interface FlowExecutionTableProps extends DescribeFlowExecutionsProps {
  detailBtn?: boolean;
  updateBtn?: boolean;
  copyBtn?: boolean;
  showExpand?: boolean;
  bordered?: boolean;
}

const FlowExecutionTable = forwardRef<FlowExecutionTableRef, FlowExecutionTableProps>((props, ref) => {
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const total = useRef(0);
  const pageSize = useRef(10);
  const pageNum = useRef(1);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  const columns: TableProps["columns"] = [
    // { colKey: "ParentId", title: "父记录", width: 200 },
    { colKey: "Uid", title: "记录UID", ellipsis: true },
    { colKey: "Version", title: "版本", ellipsis: true, width: 0 },
    { colKey: "CreatedAt", title: "创建时间", ellipsis: true },
    { colKey: "Creator", title: "创建人", width: 100, ellipsis: true },
    {
      colKey: "Input",
      title: "输入",
      // width: 300,
      ellipsis: ({ row }) => <span>{JSON.stringify(row.Input)}</span>,
      cell: ({ row }) => row.Input && <Link onClick={() => ShowJsonDialog("输入", row.Input)}>{JSON.stringify(row.Input)}</Link>,
    },
    {
      colKey: "Output",
      title: "输出",
      // width: 300,
      ellipsis: ({ row }) => <span>{JSON.stringify(row.Output, null, 2)}</span>,
      cell: ({ row }) => row.Output && <Link onClick={() => ShowJsonDialog("输出", row.Output)}>{JSON.stringify(row.Output)}</Link>,
    },
    {
      colKey: "Context",
      title: "上下文",
      // width: 300,
      ellipsis: ({ row }) => <span>{JSON.stringify(row.Context, null, 2)}</span>,
      cell: ({ row }) => row.Context && <Link onClick={() => ShowJsonDialog("上下文", row.Context)}>{JSON.stringify(row.Context)}</Link>,
    },
    { colKey: "ResourceId", title: "资源ID", ellipsis: true },
    {
      colKey: "UseTime",
      title: "耗时",
      width: 110,
      cell: ({ row }) => (
        <Popup trigger="hover" showArrow content={new Date(row.StartTime).toLocaleString() + " 至 " + new Date(row.EndTime).toLocaleString()}>
          <Link>{GetUseTimeString(row.StartTime, row.EndTime)}</Link>
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
      colKey: "action",
      title: "操作",
      width: 100,
      cell: ({ row }) => (
        <Space>
          {props.detailBtn && (
            <Link theme="primary" onClick={() => navigate("/flow_execution/" + row.Uid)}>
              详情
            </Link>
          )}
          {props.updateBtn && <UpdateExecutionDialog execution={row as FlowExecution} onUpdate={() => requestList()} />}
          {props.copyBtn && (
            <Link theme="primary" onClick={() => copyExecution(row as FlowExecution)}>
              拷贝
            </Link>
          )}
        </Space>
      ),
    },
  ];

  function copyExecution(execution: FlowExecution) {
    NiceModal.show(RunFlowVersionDialog, { flowId: execution.FlowId as string, flowVersionId: execution.FlowVersionId, inputValue: JSON.stringify(execution.Input, null, 2) });
  }

  function requestList() {
    FlowApi.DescribeFlowExecutions({ Page: pageNum.current - 1, PageSize: pageSize.current, ...props }).then((resp) => {
      if (resp.Data) {
        setTableData(resp.Data.List);
        total.current = resp.Data.Total;
      }
    });
  }
  // function requestRetry(executionId: string) {
  //   Apis.RetryFlowExecution({ Uid: executionId }).then((resp) => {
  //     if (resp.Data) {
  //       MessagePlugin.success("开始重试");
  //       requestList();
  //     }
  //   });
  // }
  const expandedRow: TableProps["expandedRow"] = ({ row }) => <FlowStepTable FlowExecutionId={row.Uid} PageSize={50} />;
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
  }, []);

  if (tableData.length == 0) {
    return <EmptyView />;
  } else {
    return (
      <Table
        ref={tableRef}
        rowKey="Uid"
        size="small"
        columns={columns}
        data={tableData}
        pagination={
          total.current > pageSize.current
            ? {
                current: pageNum.current,
                pageSize: pageSize.current,
                total: total.current,
                onChange: (pageInfo) => {
                  pageNum.current = pageInfo.current;
                  pageSize.current = pageInfo.pageSize;
                  requestList();
                },
                size: "small",
              }
            : undefined
        }
        // tableLayout="fixed"
        // verticalAlign="middle"
        // hover
        bordered={props.bordered}
        expandedRowKeys={expandedRowKeys}
        expandedRow={props.showExpand && expandedRow}
        onExpandChange={rehandleExpandChange}
        // expandOnRowClick
        expandIcon={<ChevronRightIcon />}
      ></Table>
    );
  }
});
export default FlowExecutionTable;
