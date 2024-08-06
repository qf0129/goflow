package consts

const (
	// 节点类型
	NodeTypeJob      = "job"
	NodeTypeWait     = "wait"
	NodeTypeForeach  = "foreach"
	NodeTypeChoice   = "choice"
	NodeTypeParallel = "parallel"
	NodeTypeSuccess  = "success"
	NodeTypeFail     = "fail"
	NodeTypeNotify   = "notify"

	// 触发器类型
	TriggerTypeApi   = "api"
	TriggerTypeHand  = "hand"
	TriggerTypeCron  = "cron"
	TriggerTypeTiger = "tiger"

	// 工作流状态
	FlowStatusReady     = "ready"
	FlowStatusRunning   = "running"
	FlowStatusWaiting   = "waiting"
	FlowStatusCompleted = "completed"
	FlowStatusFailed    = "failed"
	FlowStatusCancelled = "cancelled"
)
