import { Button, Dialog, Form, Input, MessagePlugin, Textarea } from "tdesign-react";
import { FC, useState } from "react";
import { Flow } from "../../../utils/types";
import { FlowApi } from "../../../apis/FlowApi";
import FormItem from "tdesign-react/es/form/FormItem";
import useForm from "tdesign-react/es/form/hooks/useForm";
import { Edit2Icon } from "tdesign-icons-react";

interface UpdateFlowDialogProps {
  flow: Flow;
  onUpdate?: () => void;
}

const UpdateFlowDialog: FC<UpdateFlowDialogProps> = ({ flow: flow, onUpdate }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  function submitRequest({ fields }: any) {
    FlowApi.ModifyFlow(fields).then((resp) => {
      if (resp.Data) {
        MessagePlugin.success("更新成功");
        onUpdate?.();
        closeDialog();
      } else {
        MessagePlugin.warning(resp.Error.Message);
      }
    });
  }

  const openDialog = () => {
    setVisible(true);
    form.setFieldsValue({
      Uid: flow.Uid,
      Name: flow.Name,
      Description: flow.Description,
    });
  };

  const closeDialog = () => {
    setVisible(false);
    form.reset();
  };
  return (
    <>
      <Button size="small" variant="text" icon={<Edit2Icon />} onClick={openDialog} />
      <Dialog visible={visible} header="更新工作流" footer={false} onClose={closeDialog} width={"800px"}>
        <Form form={form} onSubmit={submitRequest}>
          <FormItem label="Uid" name="Uid">
            <span>{flow.Uid}</span>
          </FormItem>
          <FormItem label="名称" name="Name">
            <Input />
          </FormItem>
          <FormItem label="描述" name="Description">
            <Textarea autosize={{ minRows: 3, maxRows: 5 }} />
          </FormItem>
          <div style={{ textAlign: "center", width: "100%" }}>
            <Button theme="primary" type="submit" style={{ width: "120px" }}>
              提交
            </Button>
          </div>
        </Form>
      </Dialog>
    </>
  );
};

export default UpdateFlowDialog;
