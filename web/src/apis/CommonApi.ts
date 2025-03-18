import { request, Response } from "./request";


export interface SearchCommonProps {
    Type: string // 字段类型
    Key?: string // 模糊值
}

export class CommonApi {
    static SearchCommon(params: SearchCommonProps): Promise<Response<{ SearchResults: string[] }>> {
        return request.post("/v1/apis/SearchCommon", params);
    }
}
