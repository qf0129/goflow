

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