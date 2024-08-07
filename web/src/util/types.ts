

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