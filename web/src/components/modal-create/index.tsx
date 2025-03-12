import { App, Card, Form, Modal } from "antd";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Response } from "../../apis/type";
import FormItem from "antd/es/form/FormItem";
import { ReactNode, useEffect } from "react";

interface FormItem {
  dataIndex?: string;
  title?: string;
  renderForm?: ReactNode;
}

export interface ModalCreateProps {
  title?: string;
  columns: FormItem[];
  createApi: (data: any) => Promise<Response<string>>;
  extraProps?: Record<string, any>;
  onCreate?: (resp: any) => void;
  defaultValues?: Record<string, any>;
}

export default NiceModal.create(({ columns, title, onCreate, createApi, extraProps, defaultValues }: ModalCreateProps) => {
  const modal = useModal();
  const [form] = Form.useForm();
  const app = App.useApp();

  const onSubmit = async () => {
    const result = await form.validateFields();
    createApi({ ...result, ...extraProps }).then((resp: Response<string>) => {
      if (resp.Code == 0) {
        app.message.success("创建成功");
        onCreate && onCreate(resp.Data);
      }
    });
    modal.remove();
  };

  useEffect(() => {
    form.setFieldsValue(defaultValues);
    return () => {
      form.resetFields();
    };
  }, []);

  return (
    <Modal title={title || "新增"} open={modal.visible} width={800} okText="提交" onOk={onSubmit} onCancel={modal.remove} maskClosable={true}>
      <Form form={form} labelCol={{ span: 3 }} style={{ padding: "30px 20px" }}>
        {columns.map((item) => {
          if (!item.renderForm) return;
          return (
            <FormItem key={item.dataIndex} name={item.dataIndex} label={item.title}>
              {item.renderForm}
            </FormItem>
          );
        })}
      </Form>
    </Modal>
  );
});
