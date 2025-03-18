
// 节点类型
export const NodeType = {
    Start: "start",
    End: "end",
    Job: "job",
    Pass: "pass",
    Wait: "wait",
    Choice: "choice",
    Foreach: "foreach",
    Parallel: "parallel",
    Subflow: "subflow",
    Notify: "notify",
    Consumer: "consumer",
}

// 节点类型标题
export const NodeTypeTitle: Record<string, string> = {
    start: "开始",
    end: "结束",
    job: "任务",
    pass: "PASS",
    wait: "等待",
    choice: "选择",
    foreach: "遍历",
    parallel: "并行",
    notify: "通知",
    subflow: "子流程",
    consumer: "消费者",
}

// 工作流状态
export const FlowStatus = {
    Ready: "ready",
    Running: "running",
    Waiting: "waiting",
    Completed: "completed",
    Failed: "failed",
    Cancelled: "cancelled",
}

// 工作流状态标题
export const FlowStatusTitle: Record<string, string> = {
    ready: "准备中",
    running: "运行中",
    waiting: "等待中",
    completed: "完成",
    failed: "失败",
    cancelled: "已取消",
}


export const FlowStatusTheme: Record<string, "default" | "primary" | "warning" | "danger" | "success" | undefined> = {
    ready: "default",
    running: "default",
    waiting: "warning",
    completed: "primary",
    failed: "danger",
    cancelled: "default",
}

export const FlowStatusBgColor: Record<string, string> = {
    ready: "#FFFFFF",
    running: "#87CEFA",
    waiting: "#fff143",
    completed: "#90EE90",
    failed: "#FA8072",
    cancelled: "#D3D3D3",
}