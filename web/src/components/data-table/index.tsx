import { PaginationProps, Table } from "antd";
import { DescribeProps } from "../../apis/type";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { DataTableP } from "./type";

const DataTable = <TableModel,>({ request, params, onRequest, childRef, ...props }: DataTableP<TableModel>) => {
  const requested = useRef(false);
  const [data, setData] = useState<TableModel[]>([]);
  const [loading, setLoading] = useState(false);
  const Page = useRef(1);
  const PageSize = useRef(params?.PageSize || 10);
  const Total = useRef(0);

  useImperativeHandle(childRef, () => ({
    refreshData,
    getData: () => data,
  }));

  const refreshData = (refreshParams?: DescribeProps) => {
    setLoading(true);
    request({ Page: Page.current, PageSize: PageSize.current, OrderBy: "id desc", ...params, ...refreshParams })
      .then((res) => {
        if (res.Code == 0) {
          setData(res.Data.List);
          onRequest && onRequest(res.Data.List);
          Total.current = res.Data.Total;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChangePage: PaginationProps["onChange"] = (current: number, pageSize?: number) => {
    Page.current = current;
    PageSize.current = pageSize || 10;
    refreshData();
  };

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    refreshData();
    return () => {};
  }, []);

  return (
    <Table
      loading={loading}
      dataSource={data}
      style={{ minHeight: "200px" }}
      pagination={
        Total.current > PageSize.current
          ? {
              onChange: onChangePage,
              current: Page.current,
              pageSize: PageSize.current,
              total: Total.current,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 条数据`,
            }
          : false
      }
      {...props}
    ></Table>
  );
};

export default DataTable;
