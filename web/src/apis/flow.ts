import type { Flow, FlowVersion } from "../utils/types";
import request, { type PageBody, type RespBody } from "./request";

export function ApiQueryFlow(params?: any): Promise<RespBody<PageBody<Flow>>> {
    return request.get("/api/flow", { params: params });
}

export function ApiCreateFlow(body?: any): Promise<RespBody<FlowVersion>> {
    return request.post("/api/flow", body);
}

export function ApiQueryFlowVersions(flowId: string): Promise<RespBody<PageBody<FlowVersion>>> {
    return request.get("/api/flow/" + flowId + "/version");
}

export function ApiQueryFlowVersion(id: string): Promise<RespBody<FlowVersion>> {
    return request.get(`/api/flow_version/${id}`);
}

export function ApiUpdateFlowVersion(id: string, body?: any): Promise<RespBody<FlowVersion>> {
    return request.put(`/api/flow_version/${id}`, body);
}

export function ApiPublishFlowVersion(id: string): Promise<RespBody<FlowVersion>> {
    return request.put(`/api/flow_version/${id}/published`);
}