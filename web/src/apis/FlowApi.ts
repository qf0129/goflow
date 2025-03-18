import type { Flow, FlowExecution, NodeJob, FlowStep, FlowVersion } from "../utils/types";
import { request } from "./request";


export interface ResponseBody<T> {
    Response: Response<T>
}
export interface Response<T> {
    RequestId: string;
    Data?: T;
    Error?: ErrorObject;
}

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

export interface DescribeFlowsProps {
    Uids?: string[],
    Creator?: string,
    Name?: string,
    Page?: number,
    PageSize?: number,
}

export interface CreateFlowProps {
    Name: string,
    Description?: string,
    CreateDefaultVersion?: boolean
}

export interface DescribeFlowVersionsProps {
    FlowId?: string,
    Uids?: string[],
    Creator?: string,
    Version?: string,
    Page?: number,
    PageSize?: number,
}

export interface DescribeFlowStepsProps {
    Page?: number,
    PageSize?: number,
    OrderBy?: string,

    Uids?: string[],
    Status?: string[],
    ResourceIds?: string[],
    SelectFields?: string[],
    RootFlowExecutionId?: string,
    FlowExecutionId?: string,
    NodeId?: string,
    Creator?: string,
}

export interface DescribeFlowExecutionsProps {
    Page?: number,
    PageSize?: number,
    OrderBy?: string,

    Uids?: string[],
    Status?: string[],
    ResourceIds?: string[],
    FlowId?: string,
    FlowVersionId?: string,
    RootId?: string,
    ParentId?: string,
    ParentStepId?: string,
    Creator?: string,
}

export interface CreateFlowExecutionProps {
    FlowId: string,
    FlowVersionId?: string,
    Input?: object,
}

export interface ModifyFlowStepProps {
    Uid: string,
    Input?: string,
    Output?: string,
    ResourceId?: string,
    Status?: string,
}

export interface ModifyFlowExecutionProps {
    Uid: string,
    Input?: string,
    Output?: string,
    Context?: string,
    ResourceId?: string,
    ClientToken?: string,
    Status?: string,
}

export class FlowApi {
    static DescribeFlows(params: DescribeFlowsProps): Promise<Response<PageObject<Flow>>> {
        return request.post("/v1/apis/DescribeFlows", params);
    }
    static CreateFlow(params: CreateFlowProps): Promise<Response<{ Uid: string }>> {
        return request.post("/v1/apis/CreateFlow", params);
    }
    static DeleteFlow(params: { Uid: string }): Promise<Response<{ Uid: string }>> {
        return request.post(`/v1/apis/DeleteFlow`, params);
    }
    static ModifyFlow(params: { Uid: string, Name?: string, Description?: string }): Promise<Response<Flow>> {
        return request.post("/v1/apis/ModifyFlow", params);
    }
    static DescribeFlowVersions(params: DescribeFlowVersionsProps): Promise<Response<PageObject<FlowVersion>>> {
        return request.post("/v1/apis/DescribeFlowVersions", params);
    }
    static CopyFlowVersion(params: { Uid: string }): Promise<Response<{ Uid: string }>> {
        return request.post("/v1/apis/CopyFlowVersion", params);
    }
    static DeleteFlowVersion(params: { Uid: string }): Promise<Response<{ Uid: string }>> {
        return request.post("/v1/apis/DeleteFlowVersion", params);
    }
    static ModifyFlowVersion(params: { Uid: string, Content?: string, InputTemplate?: string }): Promise<Response<{ Uid: string }>> {
        return request.post("/v1/apis/ModifyFlowVersion", params);
    }
    static PublishFlowVersion(params: { Uid: string }): Promise<Response<{ Uid: string }>> {
        return request.post("/v1/apis/PublishFlowVersion", params);
    }
    static UnPublishFlowVersion(params: { Uid: string }): Promise<Response<{ Uid: string }>> {
        return request.post("/v1/apis/UnPublishFlowVersion", params);
    }
    static DescribeFlowExecutions(params: DescribeFlowExecutionsProps): Promise<Response<PageObject<FlowExecution>>> {
        return request.post("/v1/apis/DescribeFlowExecutions", params);
    }
    static CreateFlowExecution(params: CreateFlowExecutionProps): Promise<Response<{ Uid: string }>> {
        return request.post("/v1/apis/CreateFlowExecution", params);
    }
    static RetryFlowExecution(params: { Uid: string }): Promise<Response<{ Uid: string }>> {
        return request.post("/v1/apis/RetryFlowExecution", params);
    }
    static CancelFlowExecution(params: { Uid: string }): Promise<Response<{ Uid: string }>> {
        return request.post("/v1/apis/CancelFlowExecution", params);
    }
    static ModifyFlowExecution(params?: ModifyFlowExecutionProps): Promise<Response<{ Uid: string }>> {
        return request.post("/v1/apis/ModifyFlowExecution", params);
    }
    static DescribeFlowSteps(params: DescribeFlowStepsProps): Promise<Response<PageObject<FlowStep>>> {
        return request.post("/v1/apis/DescribeFlowSteps", params);
    }
    static ModifyFlowStep(params?: ModifyFlowStepProps): Promise<Response<{ Uid: string }>> {
        return request.post("/v1/apis/ModifyFlowStep", params);
    }
    static DescribeNodeJobs(): Promise<Response<NodeJob[]>> {
        return request.post("/v1/apis/DescribeNodeJobs");
    }
    static DescribeNodeConditionOperators(): Promise<Response<string[]>> {
        return request.post("/v1/apis/DescribeNodeConditionOperators");
    }
}
