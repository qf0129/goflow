
// 工作流
export type Flow = {
    Uid?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    Creator?: string;

    Name?: string;
    Description?: string;
    PublishedVersionId?: string;
    PublishedVersion?: string;
};

// 工作流版本
export type FlowVersion = {
    Uid?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    Creator?: string;

    FlowId?: string;
    Version?: string;
    Content?: BranchConfig;
    InputTemplate?: Object;
    Published?: boolean;
};

// 工作流执行记录
export type FlowExecution = {
    Uid?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    Creator?: string;

    FlowId?: string;
    FlowVersionId?: string;
    Version?: string;
    Status?: string;
    Input?: Object;
    Output?: Object;
    Context?: Object;
    StartTime?: number;
    EndTime?: number;
    RootId?: string;
    ParentId?: string;
    ParentStepId?: string;
    ParentNodeId?: string;
    StartNodeId?: string;
    InputHash?: string;
    ResourceId?: string;
    ClientToken?: string;
};

// 工作流步骤
export type FlowStep = {
    Uid?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    Creator?: string;

    RootExecutionId?: string;
    ExecutionId?: string;
    NodeType?: string;
    NodeId?: string;
    NextNodeId?: string;
    Status?: string;
    Input?: Object;
    Output?: Object;
    StartTime?: number;
    EndTime?: number;
    ResourceId?: string;
};


// 分支配置
export type BranchConfig = {
    StartId?: string
    Nodes?: NodeConfig[]
}

// 节点配置
export interface NodeConfig {
    // common
    Id?: string
    Type?: string
    Name?: string
    NextId?: string
    InputJsonPath?: string
    InputJsonFilter?: object
    OutputJsonPath?: string
    OutputJsonFilter?: object
    ContextJsonFilter?: object
    ResourceIdJsonPath?: string
    // job
    JobGroup?: string
    JobName?: string
    CompletedCondition?: ConditionGroup
    Timeout?: number
    PollingInterval?: number
    PollingTimeout?: number
    RetryConut?: number
    RetryInterval?: number
    // choice
    Choices?: Choice[]
    ChoiceDefaultLabel?: string
    // wait
    WaitType?: string
    WaitSleepSeconds?: number
    // foreach
    ForEachJsonPath?: string
    ForEachMaxConcurrency?: number
    // foreach/parallel
    Branchs?: BranchConfig[]
    // subflow
    SubFlowId?: string
    // Notify
    NotifyUsers?: string[]
    NotifyTitle?: string
    NotifyContent?: string
}

// 选择分支
export type Choice = {
    Label?: string
    NextId?: string
    ConditionGroup?: ConditionGroup
}

// 条件组
export type ConditionGroup = {
    ConditionsType?: string // and, or
    Conditions?: Condition[]
}

// 条件
export type Condition = {
    IsNot?: boolean
    JsonPath?: string
    Operator?: string // eq,ne,gt,lt,gte,lte,in,nin,ct,nct,regexp
    ValueType?: string // string, bool, int(int64), float(float64), list([]string)
    Value?: string
}

// 节点任务
export type NodeJob = {
    Group: string
    Name: string
    Title?: string
    InputStruct?: object
    OutputStruct?: object
}

