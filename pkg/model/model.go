package model

import "time"

type BaseModel struct {
	Id         string    `gorm:"primaryKey;type:varchar(50);"`
	CreateTime time.Time `gorm:"autoCreateTime"`
}

type Node struct {
	BaseModel
	Name string
	Desc string
	Type string
}

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
	FlowStatusReady   = "ready"
	FlowStatusRunning = "running"
	FlowStatusSuccess = "success"
	FlowStatusFailed  = "failed"
)

type Flow struct {
	BaseModel
	Name string
	Desc string
}

type FlowVersion struct {
	BaseModel
	FlowId    string
	Version   string
	Published bool
	Config    string `gorm:"varchar(5000)"`
	Trigger   string `gorm:"varchar(1000)"`
}

type FlowHistory struct {
	BaseModel
	FlowId        string
	FlowVersionId string
	StartTime     time.Time
	EndTime       time.Time
	Status        string
	Input         string `gorm:"varchar(1000)"`
}

type FlowHistoryNode struct {
	BaseModel
	FlowVersionId string
	FlowHistoryId string
	NodeId        string
	Status        string
	Input         string `gorm:"varchar(1000)"`
	Output        string `gorm:"varchar(1000)"`
}
