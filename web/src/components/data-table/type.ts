import { RefObject } from "react";
import { DescribeProps, PageObject, Response } from "../../apis/type"
import { TableProps } from "antd";

export type DataTableP<TableModel> = {
  request: (params: DescribeProps) => Promise<Response<PageObject<TableModel>>>
  params?: DescribeProps;
  onRequest?: (data: TableModel[]) => void;
  childRef?: RefObject<DataTableMethods<TableModel> | undefined>;
} & TableProps<TableModel>

export interface DataTableMethods<TableModel> {
  refreshData: (refreshParams?: DescribeProps) => void;
  getData: () => TableModel[];
}
