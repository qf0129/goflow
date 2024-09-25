import axios from "axios";
import { MessagePlugin } from "tdesign-react";


export interface ErrorObject {
    Code: number;
    Message: string;
}

export interface PageObject<T> {
    List: T[];
    Page: number;
    PageSize: number;
    Total: number;
}

export interface ResponseBody<T> {
    RequestId: string;
    Data: T;
    Error: ErrorObject;
}


export const request = axios.create({
    // baseURL: 'http://localhost:8080',
    timeout: 5000,
    responseType: "json",
});

// 请求拦截器
request.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    function (response) {
        if (response.data.code !== 0) {
            MessagePlugin.warning(response.data.msg);
            console.log("RequestFailed:", response.data);
        }
        return response.data;
    },
    function (error) {
        if (error.response && error.response.status) {
            if (error.response.status === 401) {
                window.location.href = "/signin"
            } else if (error.response.status !== 200) {
                console.log("RequestError:", error.response.status);
            }
        } else {
            console.log("RequestException:", error);
        }
        return Promise.reject(error);
    }
);

// export default request;
