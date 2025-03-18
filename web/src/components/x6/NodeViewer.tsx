import { FC, useEffect } from "react";
import { NodeConfig } from "../../utils/types";
import { Button, Card, Collapse, Data, Divider, Form, Input, InputNumber, Radio, Row, Space, Tag, TagInput, Textarea } from "tdesign-react";
import useForm from "tdesign-react/es/form/hooks/useForm";
import useCallbackState from "../lib/useCallbackState";

interface NodeViewerProps {
  nodeConfig?: NodeConfig | undefined;
  onSave?: ({ fields }: any) => void;
}
export const NodeViewer: FC<NodeViewerProps> = (props) => {
  const [form] = useForm();
  const [formData, setFormData] = useCallbackState({});

  useEffect(() => {
    form.reset();
    const data = {
      ...props.nodeConfig,
      InputJsonFilter: JSON.stringify(props.nodeConfig?.InputJsonFilter, null, 2),
      OutputJsonFilter: JSON.stringify(props.nodeConfig?.OutputJsonFilter, null, 2),
      ContextJsonFilter: JSON.stringify(props.nodeConfig?.ContextJsonFilter, null, 2),
    };
    setFormData(data).then((newData: Data) => {
      form.setFieldsValue(newData);
    });
  }, [props.nodeConfig?.Id]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "#fff",
        padding: "10px",
      }}
    >
      <label>{props.nodeConfig?.Name}</label>
    </div>
  );
};
