package flow

const (
	// 节点类型
	NodeTypeJob      = "job"
	NodeTypeWait     = "wait"
	NodeTypeChoice   = "choice"
	NodeTypeForeach  = "foreach"
	NodeTypeParallel = "parallel"
	NodeTypeSubflow  = "subflow"

	NodeTypeNotify  = "notify"
	NodeTypeSuccess = "success"
	NodeTypeFail    = "fail"

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
	WaitTypeSleep = "sleep"
	WaitTypeTime  = "time"
	WaitTypeTiger = "tiger"

	// choice节点类型
	ChoiceTypeAnd = "and"
	ChoiceTypeOr  = "or"

	// choice节点条件值类型
	ConditionValueTypeString = "string"
	ConditionValueTypeBool   = "bool"
	ConditionValueTypeInt    = "int"
	ConditionValueTypeFloat  = "float"
	ConditionValueTypeList   = "list"

	// choice节点运算符
	ConditionOperatorEqual       = "eq"
	ConditionOperatorNotEqual    = "ne"
	ConditionOperatorGreterThan  = "gt"
	ConditionOperatorLessThan    = "lt"
	ConditionOperatorGreterEqual = "ge"
	ConditionOperatorLessEqual   = "le"
	ConditionOperatorIn          = "in"
	ConditionOperatorNotIn       = "nin"
	ConditionOperatorContain     = "ct"
	ConditionOperatorNotContain  = "nct"
	ConditionOperatorRegexp      = "re"
)
