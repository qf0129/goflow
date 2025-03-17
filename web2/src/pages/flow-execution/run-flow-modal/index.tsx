import { App, Card, Form, Modal } from "antd";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import FormItem from "antd/es/form/FormItem";
import { ReactNode, useEffect } from "react";
import { Apis } from "../../../apis/apis";
import { Response } from "../../../apis/type";
import TextArea from "antd/es/input/TextArea";

export interface RunFlowModalProps {
  flowId: string;
  versionId: string;
  version: string;
  onCreate?: (resp: any) => void;
}

export default NiceModal.create(({ flowId, versionId, version, onCreate }: RunFlowModalProps) => {
  const modal = useModal();
  const [form] = Form.useForm();
  const app = App.useApp();

  const onSubmit = async () => {
    const result = await form.validateFields();
    Apis.FlowExecution.Create({ FlowId: flowId, FlowVersionId: versionId, Version: version, ...result }).then((resp: Response<string>) => {
      if (resp.Code == 0) {
        app.message.success("开始执行");
        onCreate && onCreate(resp.Data);
      }
    });
    modal.remove();
  };

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);

  return (
    <Modal title="执行工作流" open={modal.visible} width={800} okText="执行" onOk={onSubmit} onCancel={modal.remove} maskClosable={true}>
      <Form form={form} labelCol={{ span: 3 }} style={{ padding: "30px 20px" }}>
        <FormItem name="Input">
          <TextArea />
        </FormItem>
      </Form>
    </Modal>
  );
});
