import { Button, Dialog, MessagePlugin, Row, Tabs } from "tdesign-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FlowApi } from "../../../apis/FlowApi";
import { FlowVersion } from "../../../utils/types";
import TabPanel from "tdesign-react/es/tabs/TabPanel";
import JsonEditor from "../../../components/JsonEditor";

interface UpdateVersionDialogProps {
  onSubmit?: () => void;
}

export interface UpdateVersionDialogRef {
  openDialog: (version: FlowVersion) => void;
}

const UpdateVersionDialog = forwardRef<UpdateVersionDialogRef, UpdateVersionDialogProps>(({ onSubmit }, ref) => {
  const [visible, setVisible] = useState(false);
  const [version, setVersion] = useState<FlowVersion | undefined>();
  const [contentText, setContentText] = useState("");
  const [inputTemplateText, setInputTemplateText] = useState("");

  useImperativeHandle(ref, () => ({
    openDialog,
  }));

  function parseJsonText(text: string) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  function submitRequest() {
    if (!version || !version.Uid) return;
    var body: Record<string, any> = {};

    if (contentText) {
      body.Content = parseJsonText(contentText);
      if (!body.Content || typeof body.Content !== "object") {
        MessagePlugin.warning("Content不是有效的json");
        return;
      }
    } else {
      body.Content = {};
    }
    if (inputTemplateText) {
      body.InputTemplate = parseJsonText(inputTemplateText);
      if (!body.InputTemplate || typeof body.InputTemplate !== "object") {
        MessagePlugin.warning("输出不是有效的json");
        return;
      }
    } else {
      body.InputTemplate = {};
    }

    FlowApi.ModifyFlowVersion(Object.assign({ Uid: version?.Uid }, body)).then((resp) => {
      if (resp.Data) {
        MessagePlugin.success("更新成功");
        onSubmit?.();
        closeDialog();
      } else {
        MessagePlugin.warning(resp.Error.Message);
      }
    });
  }

  const openDialog = (version: FlowVersion) => {
    setVisible(true);
    setVersion(version);
    setContentText(version.Content ? JSON.stringify(version.Content, null, 2) : "{}");
    setInputTemplateText(version.InputTemplate ? JSON.stringify(version.InputTemplate, null, 2) : "{}");
  };

  const closeDialog = () => {
    setVisible(false);
    setVersion(undefined);
    setContentText("");
    setInputTemplateText("");
  };

  return (
    <Dialog visible={visible} header="编辑JSON" footer={false} placement="center" onClose={closeDialog} width={1000}>
      <Tabs placement={"top"} size={"medium"} defaultValue={1}>
        <TabPanel value={1} label="工作流内容">
          <JsonEditor height={500} defaultValue={contentText} value={contentText} onChange={setContentText} />
        </TabPanel>
        <TabPanel value={2} label="输入json模板">
          <JsonEditor height={500} defaultValue={inputTemplateText} value={inputTemplateText} onChange={setInputTemplateText} />
        </TabPanel>
      </Tabs>
      <Row>
        <Button style={{ margin: "10px auto", width: "200px" }} theme="primary" onClick={submitRequest}>
          提交
        </Button>
      </Row>

      {/* <Form form={form} onSubmit={submitRequest}>
        <FormItem label="输入模板" labelAlign="top" name="InputTemplateText">
          <Textarea autosize={{ minRows: 2, maxRows: 6 }} />
        </FormItem>
        <FormItem label="内容" labelAlign="top" name="ContentText">
          <MonacoEditor height={500} />
        </FormItem>
        <FormItem>
          <Button style={{ margin: "0 auto", width: "200px" }} theme="primary" type="submit">
            提交
          </Button>
        </FormItem>
      </Form> */}
    </Dialog>
  );
});

export default UpdateVersionDialog;
