import { FC, useEffect, useState } from "react";
import { Checkbox, Col, Row } from "tdesign-react";
import JsonTips from "./JsonTips";

interface CheckFormItemProps {
  title: string;
  defaultCheck?: boolean;
  showJsonTips?: boolean;
  children: React.ReactNode;
  onChange?: (checked: boolean) => void;
}

export const CheckFormItem: FC<CheckFormItemProps> = (props) => {
  const [visiable, setVisiable] = useState(props.defaultCheck);
  useEffect(() => {
    setVisiable(props.defaultCheck);
  }, [props.defaultCheck]);

  return (
    <>
      <div>
        <Checkbox
          checked={visiable}
          onChange={(checked) => {
            setVisiable(checked);
            props.onChange?.(checked);
          }}
        >
          <Row>
            <Col>{props.title}</Col>
            <Col>{props.showJsonTips && <JsonTips />}</Col>
          </Row>
        </Checkbox>
      </div>
      <div style={{ padding: "10px 20px", display: visiable ? "block" : "none" }}>{props.children}</div>
    </>
  );
};
