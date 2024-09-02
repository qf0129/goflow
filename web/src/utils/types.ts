

export type Flow = {
    Id?: string;
    CreateTime?: string;
    Name?: string;
    Desc?: string;
};

export type FlowVersion = {
    Id?: string;
    CreateTime?: string;
    FlowId?: string;
    Version?: string;
    Published?: boolean;
    Content?: string;
    Trigger?: string;
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