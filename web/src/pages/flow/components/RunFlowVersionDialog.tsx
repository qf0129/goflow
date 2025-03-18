import { MessagePlugin, Dialog } from "tdesign-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlowApi } from "../../../apis/FlowApi";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import JsonEditor from "../../../components/JsonEditor";

export interface RunFlowVersionDialogRef {}

interface RunFlowVersionDialogProps {
  flowId: string;
  flowVersionId: string;
  inputValue?: string;
}

export default NiceModal.create(({ flowId, flowVersionId, inputValue }: RunFlowVersionDialogProps) => {
  const modal = useModal();
  const navigate = useNavigate();
  const [runInputValue, setRunInputValue] = useState(inputValue);

  function onClickRun() {
    var jsonObj = null;
    if (runInputValue) {
      try {
        jsonObj = JSON.parse(runInputValue);
      } catch (error) {
        console.log(error);
        MessagePlugin.warning("JSON格式不正确");
        return;
      }
    }
    FlowApi.CreateFlowExecution({ FlowId: flowId, FlowVersionId: flowVersionId, Input: jsonObj }).then((resp) => {
      if (resp.Data) {
        MessagePlugin.success("开始执行");
        modal.hide();
        navigate("/flow_execution/" + resp.Data.Uid);
      } else {
        MessagePlugin.warning(resp.Error?.Message || "执行失败");
      }
    });
  }

  return (
    <Dialog header="输入执行参数" visible={modal.visible} onConfirm={onClickRun} onClose={modal.remove} confirmBtn="立即执行" width={"800px"}>
      <JsonEditor height={400} value={runInputValue} onChange={setRunInputValue} />
    </Dialog>
  );
});
