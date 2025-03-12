export interface BaseModel {
    Id: string;
    Ctime: string;
    Mtime: string;
}


export interface Flow extends BaseModel {
    Name: string;
    Description: string;
    PublishedVersionId: string;
    PublishedVersion: string;
}

export interface FlowVersion extends BaseModel {
    FlowId: string;
    Version: string;
    Content: any;
    InputTemplate: any;
    Published: boolean;
}

export interface FlowRecord extends BaseModel {
    FlowId: string;
    FlowVersionId: string;
    Version: string;
    Status: string;
    Input: any;
    Output: any;
    Context: any;
    StartTime: number;
    EndTime: number;
    RootId: string;
    ParentId: string;
}

export interface FlowStep extends BaseModel {
    FlowId: string;
    RootRecordId: string;
    RecordId: string;
    NodeType: string;
    NodeId: string;
    NextNodeId: string;
    Status: string;
    Input: any;
    Output: any;
    StartTime: number;
    EndTime: number;
}
