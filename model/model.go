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

type Flow struct {
	BaseModel
	Name string
	Desc string
}

type FlowVersion struct {
	BaseModel
	FlowId    string `gorm:"index"`
	Version   string `gorm:"index"`
	Published bool
	Content   string `gorm:"varchar(5000)"`
	Trigger   string `gorm:"varchar(1000)"`
}

type FlowTask struct {
	BaseModel
	FlowId        string `gorm:"index"`
	FlowVersionId string `gorm:"index"`
	StartTime     time.Time
	EndTime       time.Time
	Status        string
	Input         string `gorm:"varchar(1000)"`
	Output        string `gorm:"varchar(1000)"`
}

type FlowSubtask struct {
	BaseModel
	FlowVersionId string `gorm:"index"`
	FlowTaskId    string `gorm:"index"`
	NodeId        string `gorm:"index"`
	NextNodeId    string `gorm:"index"`
	Status        string
	Input         string `gorm:"varchar(1000)"`
	Output        string `gorm:"varchar(1000)"`
}
