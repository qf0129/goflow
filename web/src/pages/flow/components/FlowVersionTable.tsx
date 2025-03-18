import { MessagePlugin, Popconfirm, Space, Table, TableProps, TableRowData, Link, Dropdown, DialogPlugin } from "tdesign-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlowApi } from "../../../apis/FlowApi";
import { EllipsisIcon } from "tdesign-icons-react";
import { FlowVersion } from "../../../utils/types";
import UpdateVersionDialog, { UpdateVersionDialogRef } from "./UpdateVersionDialog";
import RunFlowVersionDialog from "./RunFlowVersionDialog";
import NiceModal from "@ebay/nice-modal-react";

export interface FlowVersionTableRef {
  requestList: () => void;
}

interface FlowVersionTableProps {
  flowId: string;
  onPublishVersion?: (versionId: string) => void;
}

const FlowVersionTable = forwardRef<FlowVersionTableRef, FlowVersionTableProps>(({ flowId, onPublishVersion }, ref) => {
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const total = useRef(0);
  const pageSize = useRef(5);
  const pageNum = useRef(1);
  const navigate = useNavigate();
  const updateVersionDialogRef = useRef<UpdateVersionDialogRef>(null);

  const columns: TableProps["columns"] = [
    { colKey: "Uid", title: "UID", ellipsis: true },
    { colKey: "Version", title: "版本号", width: 180 },
    { colKey: "Creator", title: "创建人", width: 140 },
    { colKey: "CreatedAt", title: "创建时间", width: 180, ellipsis: true },
    { colKey: "Published", title: "是否发布", width: 100, cell: ({ row }) => row.Published && "✔" },
    {
      colKey: "action",
      title: "操作",
      width: 240,
      cell: ({ row }) => (
        <Space>
          <Link theme="primary" onClick={() => navigate("/flow_version/" + row.Uid + "/edit")}>
            编辑流程
          </Link>
          <Link theme="primary" onClick={() => clickPublish(row as FlowVersion)}>
            发布
          </Link>
          <Link theme="primary" onClick={() => clickUnPublish(row as FlowVersion)}>
            取消发布
          </Link>
          <Dropdown
            options={[
              { content: "编辑JSON", value: "view", onClick: () => updateVersionDialogRef.current?.openDialog(row as FlowVersion) },
              { content: "执行", value: "unPublish", onClick: () => clickRun(row as FlowVersion) },
              { content: "拷贝", value: "copy", onClick: () => clickCopy(row as FlowVersion) },
              // { content: "发布", value: "publish", onClick: () => clickPublish(row as FlowVersion) },
              // { content: "取消发布", value: "unPublish", onClick: () => clickUnPublish(row as FlowVersion) },
              { content: "删除", value: "delete", onClick: () => clickDelete(row as FlowVersion) },
            ]}
          >
            <EllipsisIcon color="var(--td-brand-color)" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  function requestList() {
    FlowApi.DescribeFlowVersions({ FlowId: flowId, Page: pageNum.current - 1, PageSize: pageSize.current }).then((resp) => {
      if (resp.Data) {
        setTableData(resp.Data.List);
        total.current = resp.Data.Total;
      }
    });
  }

  function clickRun(version: FlowVersion) {
    NiceModal.show(RunFlowVersionDialog, { flowId, flowVersionId: version.Uid, inputValue: version.InputTemplate && JSON.stringify(version.InputTemplate, null, 4) });
  }

  function clickPublish(version: FlowVersion) {
    const dialog = DialogPlugin.alert({
      header: "确认发布此版本吗",
      body: "版本: " + version.Version,
      onConfirm: () => {
        FlowApi.PublishFlowVersion({ Uid: version.Uid as string }).then((resp) => {
          if (resp.Data) {
            MessagePlugin.success("已发布");
            requestList();
            if (onPublishVersion) {
              onPublishVersion(version.Uid as string);
            }
          } else {
            MessagePlugin.warning(resp.Error.Message);
          }
          dialog.destroy();
        });
      },
      onClose: () => {
        dialog.destroy();
      },
    });
  }

  function clickUnPublish(version: FlowVersion) {
    const dialog = DialogPlugin.alert({
      header: "确认发布此版本吗",
      body: "版本: " + version.Version,
      onConfirm: () => {
        FlowApi.UnPublishFlowVersion({ Uid: version.Uid as string }).then((resp) => {
          if (resp.Data) {
            MessagePlugin.success("已取消");
            requestList();
            if (onPublishVersion) {
              onPublishVersion(version.Uid as string);
            }
          } else {
            MessagePlugin.warning(resp.Error.Message);
          }
          dialog.destroy();
        });
      },
      onClose: () => {
        dialog.destroy();
      },
    });
  }

  function clickCopy(version: FlowVersion) {
    const dialog = DialogPlugin.alert({
      header: "确认拷贝此版本吗",
      body: "版本: " + version.Version,
      onConfirm: () => {
        FlowApi.CopyFlowVersion({ Uid: version.Uid as string }).then((resp) => {
          if (resp.Data) {
            MessagePlugin.success("拷贝完成");
            requestList();
          } else {
            MessagePlugin.warning(resp.Error.Message);
          }
          dialog.destroy();
        });
      },
      onClose: () => {
        dialog.destroy();
      },
    });
  }

  function clickDelete(version: FlowVersion) {
    const dialog = DialogPlugin.alert({
      header: "确认删除此版本吗",
      body: "版本: " + version.Version,
      onConfirm: () => {
        FlowApi.DeleteFlowVersion({ Uid: version.Uid as string }).then((resp) => {
          if (resp.Data) {
            MessagePlugin.success("删除完成");
            requestList();
          } else {
            MessagePlugin.warning(resp.Error.Message);
          }
          dialog.destroy();
        });
      },
      onClose: () => {
        dialog.destroy();
      },
    });
  }

  useImperativeHandle(ref, () => ({
    requestList,
  }));

  useEffect(() => {
    if (!flowId) return;
    requestList();
  }, []);

  return (
    <>
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
                pageSize: pageSize.current,
                total: total.current,
                onCurrentChange: (index: number) => {
                  pageNum.current = index;
                  requestList();
                },
                size: "small",
              }
            : undefined
        }
        tableLayout="fixed"
        verticalAlign="middle"
        maxHeight={"500px"}
        hover
      />

      <UpdateVersionDialog ref={updateVersionDialogRef} onSubmit={requestList} />
    </>
  );
});
export default FlowVersionTable;
