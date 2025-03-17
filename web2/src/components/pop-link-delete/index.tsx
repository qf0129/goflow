import { App, Popconfirm } from "antd";
import Link from "antd/es/typography/Link";
import { Response } from "../../apis/type";

export interface PopLinkDeleteProps {
  id: string;
  deleteApi: (ids: string[]) => Promise<Response<string[]>>;
  callback?: () => void;
}

export default ({ id, deleteApi, callback }: PopLinkDeleteProps) => {
  const app = App.useApp();
  const confirm = () => {
    deleteApi([id]).then((resp) => {
      if (resp.Code == 0) {
        app.notification.success({ message: "删除成功" });
        callback && callback();
      }
    });
  };

  return (
    <Popconfirm title="确认删除" onConfirm={confirm} okText="确认" cancelText="取消">
      <Link>删除</Link>
    </Popconfirm>
  );
};
