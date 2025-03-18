import { Button, Dialog, Form, FormProps, Input, MessagePlugin, Textarea } from "tdesign-react";
import { FC, useState } from "react";
import { FlowApi } from "../../../apis/FlowApi";
import FormItem from "tdesign-react/es/form/FormItem";
import useForm from "tdesign-react/es/form/hooks/useForm";

interface CreateFlowDialogProps {
  onSubmit: () => void;
}

const CreateFlowDialog: FC<CreateFlowDialogProps> = ({ onSubmit: onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  const submitRequest: FormProps["onSubmit"] = (e) => {
    if (e.validateResult !== true) return;
    FlowApi.CreateFlow({ ...e.fields, ...{ CreateDefaultVersion: true } }).then((resp) => {
      if (resp.Data) {
        MessagePlugin.success("创建成功");
        onSubmit();
        closeDialog();
      } else {
        MessagePlugin.warning(resp.Error.Message);
      }
    });
  };

  const openDialog = () => {
    setVisible(true);
    form.setFieldsValue({
      Name: "",
      Description: "",
    });
  };

  const closeDialog = () => {
    setVisible(false);
    form.reset();
  };

  return (
    <>
      <Button onClick={openDialog}>新建工作流</Button>
      <Dialog visible={visible} header="新建工作流" footer={false} onClose={closeDialog} width={"800px"}>
        <Form form={form} onSubmit={submitRequest}>
          <FormItem
            label="名称"
            name="Name"
            rules={[
              { whitespace: true, message: "名称不能为空" },
              { required: true, message: "名称必填", type: "error" },
              { min: 2, message: "名称太短(至少2个字符)", type: "error" },
              { max: 100, message: "名称太长(最多100个字符)", type: "error" },
            ]}
          >
            <Input placeholder="工作流名称" />
          </FormItem>
          <FormItem label="描述" name="Description" rules={[{ max: 500, message: "描述太长(最多500个字符)", type: "error" }]}>
            <Textarea autosize={{ minRows: 3, maxRows: 5 }} placeholder="工作流描述" />
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

export default CreateFlowDialog;
