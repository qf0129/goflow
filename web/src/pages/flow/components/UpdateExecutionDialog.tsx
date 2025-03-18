import { Button, Dialog, Form, Input, Link, MessagePlugin, Select, Textarea } from "tdesign-react";
import { FC, useState } from "react";
import { FlowExecution } from "../../../utils/types";
import { FlowApi } from "../../../apis/FlowApi";
import FormItem from "tdesign-react/es/form/FormItem";
import { FlowStatusTitle } from "../../../utils/consts";
import useForm from "tdesign-react/es/form/hooks/useForm";

interface UpdateExecutionDialogProps {
  execution: FlowExecution;
  onUpdate: () => void;
}

const UpdateExecutionDialog: FC<UpdateExecutionDialogProps> = ({ execution, onUpdate }) => {
  const [visible, setVisible] = useState(false);
  const [form] = useForm();

  function parseJsonText(text: string) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  function submitRequest({ fields }: any) {
    if (fields.InputText) {
      fields.Input = parseJsonText(fields.InputText);
      if (!fields.Input || typeof fields.Input !== "object") {
        MessagePlugin.warning("输入不是有效的json");
        return;
      }
    } else {
      fields.Input = {};
    }
    if (fields.OutputText) {
      fields.Output = parseJsonText(fields.OutputText);
      if (!fields.Output || typeof fields.Output !== "object") {
        MessagePlugin.warning("输出不是有效的json");
        return;
      }
    } else {
      fields.Output = {};
    }
    if (fields.ContextText) {
      fields.Context = parseJsonText(fields.ContextText);
      if (!fields.Context || typeof fields.Context !== "object") {
        MessagePlugin.warning("上下文不是有效的json");
        return;
      }
    } else {
      fields.Context = {};
    }
    FlowApi.ModifyFlowExecution(fields).then((resp) => {
      if (resp.Data) {
        MessagePlugin.success("更新成功");
        onUpdate();
        closeDialog();
      } else {
        MessagePlugin.warning(resp.Error.Message);
      }
    });
  }

  const openDialog = () => {
    setVisible(true);
    form.setFieldsValue({
      Uid: execution.Uid,
      Status: execution.Status,
      ResourceId: execution.ResourceId,
      ClientToken: execution.ClientToken,
      InputText: execution.Input ? JSON.stringify(execution.Input) : "",
      OutputText: execution.Output ? JSON.stringify(execution.Output) : "",
      ContextText: execution.Context ? JSON.stringify(execution.Context) : "",
    });
  };

  const closeDialog = () => {
    setVisible(false);
    form.reset();
  };

  return (
    <>
      <Link theme="primary" onClick={openDialog}>
        查看
      </Link>
      <Dialog visible={visible} header="执行记录" footer={false} onClose={closeDialog} width={"800px"} placement="center">
        <Form form={form} onSubmit={submitRequest}>
          <FormItem label="Uid" name="Uid">
            <span>{execution.Uid}</span>
          </FormItem>
          <FormItem label="状态" name="Status">
            <Select options={Object.entries(FlowStatusTitle).map(([k, v]) => ({ label: v, value: k }))} />
          </FormItem>
          <FormItem label="输入" name="InputText">
            <Textarea autosize={{ minRows: 2, maxRows: 10 }} />
          </FormItem>
          <FormItem label="输出" name="OutputText">
            <Textarea autosize={{ minRows: 2, maxRows: 10 }} />
          </FormItem>
          <FormItem label="上下文" name="ContextText">
            <Textarea autosize={{ minRows: 2, maxRows: 10 }} />
          </FormItem>
          <FormItem label="资源id" name="ResourceId">
            <Input />
          </FormItem>
          <FormItem label="业务令牌" name="ClientToken">
            <Input />
          </FormItem>
          <div style={{ textAlign: "center", width: "100%" }}>
            <Button theme="primary" type="submit" style={{ width: "120px" }}>
              更新
            </Button>
          </div>
        </Form>
      </Dialog>
    </>
  );
};

export default UpdateExecutionDialog;
