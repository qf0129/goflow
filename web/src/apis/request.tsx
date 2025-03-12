import { App } from "antd";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState, ReactNode } from "react";

axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
const req = axios.create({
  timeout: 10000,
});

const AxiosInterceptor = ({ children }: { children: ReactNode }) => {
  const [isSet, setIsSet] = useState(false);
  const app = App.useApp();

  useEffect(() => {
    // 请求拦截器
    req.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    const interceptor = req.interceptors.response.use(
      (response: AxiosResponse<any, any>) => {
        console.log("Response:", response);
        if (response.data.Code != 0) {
          app.notification.warning({ message: "接口请求失败", description: response.data.Msg });
        }
        return response.data;
      },
      (error) => {
        app.notification.error({ message: "接口请求异常", description: error });
        console.log("RequestError:", error);
        return Promise.reject(error);
      }
    );

    setIsSet(true);
    return () => req.interceptors.response.eject(interceptor);
  }, []);

  return isSet && children;
};

export default req;
export { AxiosInterceptor };
