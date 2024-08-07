import type { Flow, FlowVersion } from "@/util/types";
import request, { type PageBody, type RespBody } from "./request";

export function ApiQueryFlow(params?: any): Promise<RespBody<PageBody<Flow>>> {
    return request.get("/api/flow", { params: params });
}

export function ApiQueryFlowVersion(flowId: string): Promise<RespBody<PageBody<FlowVersion>>> {
    return request.get("/api/flow/" + flowId + "/version");
}
