import req from "./request";

export interface PageObject<T> {
    List: T[];
    Page: number;
    PageSize: number;
    Total: number;
}

export interface Response<T> {
    ReqId: string;
    Code: number;
    Msg: string;
    Data: T;
}

export interface DescribeProps {
    Page?: number; // 查询页数
    PageSize?: number; // 每页数量
    Select?: string[]; // 指定查询字段
    Filter?: Record<string, any>; // 简单查询
    Preload?: Record<string, any[]>; // 预加载
    OrderBy?: string; // 排序
}


export class CrudApi<T> {
    model: string;

    constructor(model: string) {
        this.model = model;
    }
    Describe = (props?: DescribeProps): Promise<Response<PageObject<T>>> => {
        return req.post("/api/Query" + this.model, props);
    }
    Create = (data: T): Promise<Response<string>> => {
        return req.post("/api/Create" + this.model, data);
    }
    Modify = (id: string, data: T): Promise<Response<string>> => {
        return req.post("/api/Modify" + this.model, { Id: id, Data: data });
    }
    Delete = (ids: string[]): Promise<Response<string[]>> => {
        return req.post("/api/Delete" + this.model, { Ids: ids });
    }
}

