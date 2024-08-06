import router from "@/router";
import axios from "axios";
import { MessagePlugin } from "tdesign-vue-next";

// 响应结构体
export type RespBody<T> = {
    req_id: string;
    code: number;
    msg: string;
    data: T;
};

// 分页数据结构体
export type PageBody<T> = {
    list: Array<T>;
    page_num: number;
    page_size: number;
    total: number;
};

const request = axios.create({
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
                router.push("/signin");
            } else if (error.response.status !== 200) {
                console.log("RequestError:", error.response.status);
            }
        } else {
            console.log("RequestException:", error);
        }
        return Promise.reject(error);
    }
);

export default request;
