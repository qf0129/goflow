

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

export type FlowVersion = {
    Uid?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    Creator?: string;

    FlowId?: string;
    Version?: string;
    Content?: string;
    Published?: boolean;
};

export type FlowExecution = {
    Uid?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    Creator?: string;

    FlowId?: string;
    FlowVersionId?: string;
    Status?: string;
    Input?: Object;
    Output?: Object;
    StartTime?: string;
    EndTime?: string;
    ResourceId?: string;
    ParentFlowExecutionId?: string;
    ParentFlowStepId?: string;
    ParentNodeId?: string;
    StartNodeId?: string;
    InputMd5?: string;

};
export type FlowStep = {
    Uid?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    Creator?: string;

    FlowExecutionId?: string;
    NodeType?: string;
    NodeId?: string;
    NextNodeId?: string;
    Status?: string;
    Input?: Object;
    Output?: Object;
    StartTime?: string;
    EndTime?: string;
};


export type FlowContent = {
    StartNodeId: string
    NodeMap: Record<string, FlowContentNode>
}

export type FlowContentNode = {
    Id?: string
    Type?: string
    Name?: string
    Config?: string
    NextId?: string
}


export type Branch = {
    StartId?: string
    Nodes?: NodeConfig[]
}

export type NodeConfig = {
    Id?: string
    Type?: string
    Name?: string
    // Config?: string
    NextId?: string
    InputPath?: Record<string, string>
    OutputPath?: Record<string, string>
    JobGroup?: string
    JobName?: string
    // Choices?: []*Choice
    WaitType?: string
    WaitSeconds?: number
    ForEachPath?: string
    // Branchs?: []*Branch
    SubFlowId?: string
    SubFlowVersionId?: string
}