import type { Flow, FlowExecution, FlowStep, FlowVersion } from "../utils/types";
import { ResponseBody, PageObject, request } from "./request";


export class Apis {
    static post(path: string, body?: any): any {
        return request.post(path, body);
    }
    static GetFlows(params?: {
        Ids?: string[], Creator?: string, Name?: string, Page?: number, PageSize?: number,
    }): Promise<ResponseBody<PageObject<Flow>>> {
        return Apis.post("/v1/apis/flow/GetFlows", params);
    }
    static CreateFlow(params: { Name: string, Description?: string }): Promise<ResponseBody<{ FlowId: string, FlowVersionId: string }>> {
        return request.post("/v1/apis/flow/CreateFlow", params);
    }
    static DeleteFlow(params: { FlowId: string }): Promise<ResponseBody<{ FlowId: string }>> {
        return request.post(`/v1/apis/flow/DeleteFlow`, params);
    }
    static UpdateFlow(params: { FlowId: string, Name?: string, Description?: string }): Promise<ResponseBody<Flow>> {
        return request.post("/v1/apis/flow/UpdateFlow", params);
    }
    static GetFlowVersions(params: {
        FlowId: string,
        Ids?: string[],
        Creator?: string,
        Version?: string,
        Page?: number,
        PageSize?: number,
    }): Promise<ResponseBody<PageObject<FlowVersion>>> {
        return request.post("/v1/apis/flow_version/GetFlowVersions", params);
    }
    static CopyFlowVersion(params: { CopyFlowVersionId: string }): Promise<ResponseBody<{ FlowVersionId: string }>> {
        return request.post("/v1/apis/flow_version/CopyFlowVersion", params);
    }
    static DeleteFlowVersion(params: { FlowVersionId: string }): Promise<ResponseBody<{ FlowVersionId: string }>> {
        return request.post("/v1/apis/flow_version/DeleteFlowVersion", params);
    }
    static UpdateFlowVersion(params: { FlowVersionId: string, Content: string }): Promise<ResponseBody<{ FlowVersionId: string }>> {
        return request.post("/v1/apis/flow_version/UpdateFlowVersion", params);
    }
    static PublishFlowVersion(params: { FlowVersionId: string, Published: boolean }): Promise<ResponseBody<{ FlowVersionId: string }>> {
        return request.post("/v1/apis/flow_version/PublishFlowVersion", params);
    }

    static GetFlowExecutions(params: {
        FlowId?: string,
        ResourceIds?: string[],
        FlowVersionId?: string,
        ParentFlowExecutionId?: string,
        Ids?: string[],
        Creator?: string,
        Status?: string[],
        Page?: number,
        PageSize?: number,
    }): Promise<ResponseBody<PageObject<FlowExecution>>> {
        return request.post("/v1/apis/flow_execution/GetFlowExecutions", params);
    }

    static CreateFlowExecution(params: {
        FlowId: string,
        FlowVersionId?: string,
        Input?: Map<string, any>,
    }): Promise<ResponseBody<{ FlowExecutionId: string }>> {
        return request.post("/v1/apis/flow_execution/CreateFlowExecution", params);
    }
    static RetryFlowExecution(params: { FlowExecutionId: string }): Promise<ResponseBody<{ FlowExecutionId: string }>> {
        return request.post("/v1/apis/flow_execution/RetryFlowExecution", params);
    }
    static ResumeFlowExecution(params: { FlowExecutionId: string }): Promise<ResponseBody<{ FlowExecutionId: string }>> {
        return request.post("/v1/apis/flow_execution/ResumeFlowExecution", params);
    }

    static GetFlowSteps(params: {
        FlowExecutionId?: string,
        NodeId?: string,
        Creator?: string,
        Status?: string,
        Page?: number,
        PageSize?: number,
    }): Promise<ResponseBody<PageObject<FlowStep>>> {
        return request.post("/v1/apis/flow_step/GetFlowSteps", params);
    }
    static GetFlowJobs(params: {}): Promise<ResponseBody<any>> {
        return request.post("/v1/apis/flow_job/GetFlowJobs", params);
    }

}
