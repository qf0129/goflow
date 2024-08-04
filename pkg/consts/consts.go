package consts

const (
	// 节点类型
	NodeTypeJob     = "job"
	NodeTypeWait    = "wait"
	NodeTypeLoop    = "loop"
	NodeTypeChoice  = "choice"
	NodeTypeParalle = "paralle"
	NodeTypeSuccess = "success"
	NodeTypeFailed  = "failed"

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
