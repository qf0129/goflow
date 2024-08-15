

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
    job: "任务节点",
    wait: "等待节点",
    foreach: "遍历节点",
    choice: "选择节点",
    parallel: "并行节点",
    success: "成功节点",
    fail: "失败节点",
    notify: "通知节点",
}