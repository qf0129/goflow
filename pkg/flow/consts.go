package flow

const (
	// 节点类型
	NodeTypeStart    = "start"
	NodeTypeEnd      = "end"
	NodeTypeJob      = "job"
	NodeTypePass     = "pass"
	NodeTypeWait     = "wait"
	NodeTypeNotify   = "notify"
	NodeTypeChoice   = "choice"
	NodeTypeForeach  = "foreach"
	NodeTypeSubflow  = "subflow"
	NodeTypeParallel = "parallel"
	NodeTypeConsumer = "consumer"

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

	// wait节点类型
	WaitTypeStop  = "stop"  // 停止进程
	WaitTypeTime  = "time"  // 停止进程，等待指定秒数后触发
	WaitTypeSleep = "sleep" // 不停止进程，等待指定秒数
	// WaitTypeTiger = "tiger" // 停止进程，等待tiger消息触发

)
