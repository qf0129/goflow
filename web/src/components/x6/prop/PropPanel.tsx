import "./PropPanel.less";
import { FC, useEffect, useState } from "react";
import { NodeConfig } from "../../../utils/types";
import { Form, Input } from "tdesign-react";

interface PropPanelProps {
  config: NodeConfig | undefined;
  onSave: (editConfig: NodeConfig | undefined) => void;
}

const { FormItem } = Form;

const PropPanel: FC<PropPanelProps> = ({ config, onSave }) => {
  const [form] = Form.useForm();

  const [editConfig, setEditConfig] = useState<NodeConfig | undefined>(config);

  useEffect(() => {
    setEditConfig(config);
    form.reset();
  }, [config?.Id]);

  const onChangeConfig = (newKV: NodeConfig) => {
    setEditConfig({ ...editConfig, ...newKV });
    onSave({ ...editConfig, ...newKV });
  };

  return (
    <div className="prop-panel" style={{ right: config ? "20px" : "-400px" }}>
      <div>属性面板</div>
      {config && (
        <div>
          <div>{config.Id}</div>
          <div>{config.Type}</div>
          <Form form={form} layout="vertical" resetType="initial" preventSubmitDefault showErrorMessage>
            <FormItem label="名称" initialData={config?.Name} name="Name">
              <Input
                value={editConfig?.Name}
                onChange={(v) => {
                  onChangeConfig({ Name: v });
                }}
              />
            </FormItem>
          </Form>
        </div>
      )}
    </div>
  );
};

export default PropPanel;
