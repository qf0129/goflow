import { FC, useEffect, useState } from "react";
import { NodeJob, NodeConfig } from "../../utils/types";
import {
  Button,
  Cascader,
  CascaderValue,
  Checkbox,
  Col,
  Collapse,
  Data,
  Form,
  FormListField,
  FormListFieldOperation,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  SelectOption,
  SelectValue,
  Space,
  TagInput,
  Textarea,
} from "tdesign-react";
import useForm from "tdesign-react/es/form/hooks/useForm";
import FormItem from "tdesign-react/es/form/FormItem";
import { NodeTypeTitle } from "../../utils/consts";
import CollapsePanel from "tdesign-react/es/collapse/CollapsePanel";
import useCallbackState from "../lib/useCallbackState";
import { CheckFormItem } from "../CheckFormItem";
import { FlowApi } from "../../apis/FlowApi";
import { OptionData, TreeOptionData } from "tdesign-react/es/common";
import JsonTips from "../JsonTips";
import { Delete1Icon, DeleteIcon, MinusCircleIcon } from "tdesign-icons-react";

interface NodeFormProps {
  nodeConfig?: NodeConfig | undefined;
  onSave?: ({ fields }: any) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export const NodeForm: FC<NodeFormProps> = (props) => {
  const [form] = useForm();
  const [formData, setFormData] = useCallbackState({});
  const [jobs, setJobs] = useState<NodeJob[]>([]);
  const [jobGroupOptions, setJobGroupOptions] = useState<OptionData[]>([]);
  const [jobOptions, setJobOptions] = useState<OptionData[]>([]);
  const [operatorOptions, setOperatorOptions] = useState<OptionData[]>([]);

  useEffect(() => {
    requestNodeJobs();
    requestOperators();
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

  const requestNodeJobs = () => {
    FlowApi.DescribeNodeJobs().then((resp) => {
      if (resp.Data) {
        setJobs(resp.Data);
        setJobGroupOptions(resp.Data.map((job) => ({ value: job.Group, label: job.Group })));
        setJobOptions(resp.Data.map((job) => ({ value: job.Name, label: job.Name })));
      }
    });
  };

  const requestOperators = () => {
    FlowApi.DescribeNodeConditionOperators().then((resp) => {
      if (resp.Data) {
        setOperatorOptions(resp.Data.map((operator) => ({ value: operator, label: operator })));
      }
    });
  };

  const onChangeJobGroup = (value: SelectValue<SelectOption>) => {
    setJobOptions(jobs.filter((job) => job.Group === value).map((job) => ({ value: job.Name, label: job.Name })));
  };

  const contiditionGroup: (fields: FormListField[], operation: FormListFieldOperation) => React.ReactNode = (fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <FormItem key={key} style={{ marginBottom: "5px" }}>
          <FormItem {...restField} name={[name, "IsNot"]} style={{ marginRight: "5px" }}>
            <Checkbox>Not</Checkbox>
          </FormItem>
          <FormItem {...restField} name={[name, "ValueA"]} style={{ marginRight: "5px" }}>
            <Input style={{ width: "120px" }} />
          </FormItem>
          <FormItem {...restField} name={[name, "Operator"]} style={{ marginRight: "5px" }}>
            <Select options={operatorOptions} placeholder="运算符" style={{ width: "120px" }} />
          </FormItem>
          <FormItem {...restField} name={[name, "ValueB"]} style={{ marginRight: "5px" }}>
            <Input style={{ width: "120px" }} />
          </FormItem>
          <FormItem>
            <MinusCircleIcon size="20px" style={{ cursor: "pointer" }} onClick={() => remove(name)} />
          </FormItem>
        </FormItem>
      ))}
      <FormItem>
        <Button theme="primary" variant="dashed" size="small" onClick={() => add({ province: "bj", area: "tzmax" })}>
          添加条件
        </Button>
      </FormItem>
    </>
  );

  const choiceItem: (fields: FormListField[], operation: FormListFieldOperation) => React.ReactNode = (fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Row key={key} style={{ marginBottom: "5px", backgroundColor: "#f5f5f5" }}>
          <FormItem {...restField} name={[name, "Label"]} style={{ marginRight: "5px" }}>
            <Input style={{ width: "120px" }} placeholder="标签" />
          </FormItem>
          <FormItem name={[name, "ConditionGroup", "ConditionsType"]} initialData={"and"} label="条件类型" style={formItemStyle}>
            <Radio.Group>
              <Radio value="and">And</Radio>
              <Radio value="or">Or</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem>
            <DeleteIcon size="20px" style={{ cursor: "pointer" }} onClick={() => remove(name)} />
          </FormItem>
          <Form.FormList name={[name, "ConditionGroup"]}>{contiditionGroup}</Form.FormList>
        </Row>
      ))}
      <FormItem>
        <Button theme="primary" variant="dashed" onClick={() => add({ province: "bj", area: "tzmax" })}>
          添加选择分支
        </Button>
      </FormItem>
    </>
  );

  const formItemStyle = { marginBottom: "5px" };

  return (
    <Form disabled={props.disabled} form={form} resetType="empty" labelAlign="left" onSubmit={props?.onSave}>
      <Collapse borderless defaultExpandAll>
        <CollapsePanel header="基本信息">
          <FormItem label="Id" name="Id" style={formItemStyle}>
            {formData.Id}
          </FormItem>
          <FormItem label="类型" name="Type" style={formItemStyle}>
            {NodeTypeTitle[formData.Type as string]} ({formData.Type})
          </FormItem>
          <FormItem label="名称" name="Name" style={formItemStyle}>
            <Input />
          </FormItem>
        </CollapsePanel>
        <CollapsePanel header={NodeTypeTitle[formData.Type as string] + "节点"}>
          {formData.Type === "job" && (
            <>
              <FormItem label="任务" style={formItemStyle}>
                <FormItem name="JobGroup">
                  <Select options={jobGroupOptions} placeholder="选择任务组" onChange={onChangeJobGroup} style={{ width: "140px" }} />
                </FormItem>
                <FormItem name="JobName">
                  <Select options={jobOptions} placeholder="选择任务" style={{ width: "140px" }} />
                </FormItem>
              </FormItem>
              <CheckFormItem title="设置超时" defaultCheck={!!formData.Timeout}>
                <FormItem name="Timeout" label="超时秒数" style={formItemStyle}>
                  <InputNumber />
                </FormItem>
              </CheckFormItem>
              <CheckFormItem title="启用轮询" defaultCheck={!!formData.PollingInterval || !!formData.PollingTimeout}>
                <FormItem name="PollingInterval" label="轮询间隔秒数" style={formItemStyle}>
                  <InputNumber />
                </FormItem>
                <FormItem name="PollingTimeout" label="轮询超时秒数" style={formItemStyle}>
                  <InputNumber />
                </FormItem>
              </CheckFormItem>
              <CheckFormItem title="启用重试" defaultCheck={!!formData.PollingInterval || !!formData.PollingTimeout}>
                <FormItem name="RetryConut" label="重试次数" style={formItemStyle}>
                  <InputNumber />
                </FormItem>
                <FormItem name="RetryInterval" label="重试间隔秒数" style={formItemStyle}>
                  <InputNumber />
                </FormItem>
              </CheckFormItem>
              <CheckFormItem title="自定义成功条件">
                <FormItem name={["CompletedCondition", "ConditionsType"]} initialData={"and"} label="条件类型" style={formItemStyle}>
                  <Radio.Group>
                    <Radio value="and">And</Radio>
                    <Radio value="or">Or</Radio>
                  </Radio.Group>
                </FormItem>
                <Form.FormList name={["CompletedCondition", "Conditions"]}>{contiditionGroup}</Form.FormList>
              </CheckFormItem>
            </>
          )}
          {formData.Type === "choice" && (
            <>
              <FormItem label="默认分支标签" name="ChoiceDefaultLabel" style={formItemStyle}>
                <Input />
              </FormItem>
              <FormItem name="Choices" style={formItemStyle}>
                <div>
                  <Form.FormList name="Choices">{choiceItem}</Form.FormList>
                </div>
              </FormItem>
            </>
          )}
          {formData.Type === "wait" && (
            <>
              <FormItem name="WaitType" label="等待类型" style={formItemStyle}>
                <Radio.Group onChange={() => {}}>
                  <Radio value="stop">停止等待</Radio>
                  <Radio value="sleep">等待指定秒数</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem name="WaitSleepSeconds" shouldUpdate={(prev, next) => prev.WaitType !== next.WaitType}>
                {({ getFieldValue }) => {
                  if (getFieldValue("WaitType") === "sleep") {
                    return (
                      <FormItem name="WaitSleepSeconds" label="等待秒数" style={formItemStyle}>
                        <InputNumber />
                      </FormItem>
                    );
                  }
                  return <></>;
                }}
              </FormItem>
            </>
          )}
          {formData.Type === "foreach" && (
            <>
              <FormItem name="ForEachJsonPath" label="遍历JsonPath" style={formItemStyle}>
                <Input placeholder="遍历的目标值，JsonPath语法" />
                <JsonTips />
              </FormItem>
              <FormItem name="ForEachMaxConcurrency" label="遍历最大并发数" style={formItemStyle}>
                <InputNumber />
              </FormItem>
            </>
          )}
          {formData.Type === "subflow" && (
            <>
              <FormItem name="SubFlowId" label="工作流id" style={formItemStyle}>
                <Input />
              </FormItem>
            </>
          )}
          {formData.Type === "notify" && (
            <>
              <FormItem name="NotifyUsers" label="通知用户" style={formItemStyle}>
                <TagInput placeholder="花名拼音，按回车后添加多个" />
              </FormItem>
              <FormItem name="NotifyTitle" label="通知标题" style={formItemStyle}>
                <Input placeholder="通知标题" />
              </FormItem>
              <FormItem name="NotifyContent" label="通知内容" style={formItemStyle}>
                <Textarea placeholder="通知文本，可使用{key}填充输入的变量" />
              </FormItem>
            </>
          )}
        </CollapsePanel>
        <CollapsePanel header="输入输出">
          <CheckFormItem title="输入JsonPath" defaultCheck={!!formData.InputJsonPath} showJsonTips>
            <FormItem name="InputJsonPath" style={formItemStyle}>
              <Input placeholder="节点入参，JsonPath语法" />
            </FormItem>
          </CheckFormItem>
          <CheckFormItem title="输入JsonFilter" defaultCheck={!!formData.InputJsonFilter} showJsonTips>
            <FormItem name="InputJsonFilter" style={formItemStyle}>
              <Textarea placeholder="节点入参，JsonFilter语法" />
            </FormItem>
          </CheckFormItem>
          <CheckFormItem title="输出JsonPath" defaultCheck={!!formData.OutputJsonPath} showJsonTips>
            <FormItem name="OutputJsonPath" style={formItemStyle}>
              <Input placeholder="节点输出，JsonPath语法" />
            </FormItem>
          </CheckFormItem>
          <CheckFormItem title="输出JsonFilter" defaultCheck={!!formData.OutputJsonFilter} showJsonTips>
            <FormItem name="OutputJsonFilter" style={formItemStyle}>
              <Textarea placeholder="节点输出，JsonFilter语法" />
            </FormItem>
          </CheckFormItem>
        </CollapsePanel>
        <CollapsePanel header="其他">
          <CheckFormItem title="设置上下文变量(JsonFilter)" defaultCheck={!!formData.ContextJsonFilter} showJsonTips>
            <FormItem name="ContextJsonFilter" style={formItemStyle}>
              <Textarea placeholder="上下文变量，JsonFilter语法" />
            </FormItem>
          </CheckFormItem>
          <CheckFormItem title="设置资源Id(JsonPath)" defaultCheck={!!formData.ResourceIdJsonPath} showJsonTips>
            <FormItem name="ResourceIdJsonPath" style={formItemStyle}>
              <Input placeholder="设置资源id，JsonPath语法，流程中设置一次即可" />
            </FormItem>
          </CheckFormItem>
        </CollapsePanel>
      </Collapse>
      {!props.disabled && (
        <Row>
          <Button theme="primary" type="submit" style={{ margin: "10px auto", width: "120px" }}>
            更新
          </Button>
        </Row>
      )}
    </Form>
  );
};
