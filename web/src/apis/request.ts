import axios, { AxiosResponse } from "axios";
import { MessagePlugin } from "tdesign-react";
import CryptoJS from "crypto-js"


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
export interface Response<T> {
    RequestId: string;
    Data: T;
    Error: ErrorObject;
}

export interface ResponseBody<T> {
    Response: Response<T>
}

var appId = "gaia";
var appKey = "664d9620845f8e36519d971297c51f41";
var random = "123456";

export const request = axios.create({
    timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
    function (config) {
        var timestamp = Math.round(new Date().getTime() / 1000);
        var sig = CryptoJS.MD5(appKey + random + timestamp).toString(CryptoJS.enc.Hex);
        config.headers.set("AppId", appId)
        config.headers.set("Random", random)
        config.headers.set("TimeStamp", timestamp)
        config.headers.set("Signature", sig)
        config.headers.set("Content-Type", "application/json")
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    function (response: AxiosResponse<any, any>) {
        if (response.data.Response.Error) {
            MessagePlugin.error(response.data.Response.Error.Message);
        }
        return response.data.Response;
    },
    function (error) {
        // if (error.response && error.response.status) {
        //     if (error.response.status === 401) {
        //         window.location.href = "/signin"
        //     } else if (error.response.status !== 200) {
        //         console.log("RequestError:", error.response.status);
        //         MessagePlugin.error(error);
        //     }
        // } else {
        //     console.log("RequestException:", error);
        //     MessagePlugin.error(error);
        // }
        console.log("RequestError:", error);
        return Promise.reject(error);
    }
);

// export default request;
