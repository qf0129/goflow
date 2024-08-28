

export const NodeType = {
    Job: "job",
    Wait: "wait",
    Foreach: "foreach",
    Choice: "choice",
    Parallel: "parallel",
    Success: "success",
    Fail: "fail",
    Notify: "notify",
}

export const NodeTypeTitle: Record<string, string> = {
    job: "任务",
    choice: "选择",
    // foreach: "遍历",
    // parallel: "并行",
    wait: "等待",
    success: "成功",
    fail: "失败",
    notify: "通知",
}