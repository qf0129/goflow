import { CheckboxOptionType, Radio, RadioGroupProps } from "antd";
import { BaseModel } from "../../utils/type";
import { DescribeProps, PageObject, Response } from "../../apis/type";
import { useEffect, useRef, useState } from "react";

interface DataRadioProps {
  valueKey: string;
  labelKey: string;
  request: (params: DescribeProps) => Promise<Response<PageObject<BaseModel>>>;
  params?: DescribeProps;
  onRequest?: (options: CheckboxOptionType[]) => void;
}

export default ({ valueKey, labelKey, request, params, onRequest, ...props }: DataRadioProps & RadioGroupProps) => {
  const requested = useRef(false);
  const [options, setOptions] = useState<CheckboxOptionType[]>([]);

  const refreshData = () => {
    request({ PageSize: 100, ...params }).then((res) => {
      if (res.Code == 0) {
        let opts: CheckboxOptionType[] = [];
        opts = res.Data.List.map((item: any) => ({ value: item[valueKey], label: item[labelKey] }));
        setOptions(opts);
        onRequest && onRequest(opts);
      }
    });
  };

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    refreshData();
    return () => {};
  }, []);
  return <Radio.Group options={options} {...props} />;
};
