package model

import (
	"time"

	"github.com/rs/xid"
	"gorm.io/gorm"
)

type BaseModel struct {
	Id         string    `gorm:"primaryKey;type:varchar(50);"`
	CreateTime time.Time `gorm:"autoCreateTime"`
}

func (m *BaseModel) BeforeCreate(tx *gorm.DB) (err error) {
	if m.Id == "" {
		m.Id = xid.New().String()
	}
	return
}

// type Node struct {
// 	BaseModel
// 	Name string
// 	Desc string
// 	Type string
// }

type Flow struct {
	BaseModel
	Name    string
	Desc    string
	Trigger string `gorm:"varchar(1000)"`
}

type FlowVersion struct {
	BaseModel
	FlowId    string `gorm:"index"`
	Version   string `gorm:"index"`
	Content   string `gorm:"varchar(5000)"`
	Published bool
}

type FlowExecution struct {
	BaseModel
	FlowId        string `gorm:"index"`
	FlowVersionId string `gorm:"index"`
	StartTime     time.Time
	EndTime       time.Time
	Status        string
	Input         string `gorm:"varchar(1000)"`
	Output        string `gorm:"varchar(1000)"`
}

type FlowStep struct {
	BaseModel
	FlowVersionId   string `gorm:"index"`
	FlowExecutionId string `gorm:"index"`
	NodeId          string `gorm:"index"`
	NextNodeId      string `gorm:"index"`
	Status          string
	Input           string `gorm:"varchar(1000)"`
	Output          string `gorm:"varchar(1000)"`
}
