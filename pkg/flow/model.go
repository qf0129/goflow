package flow

import (
	"github.com/qf0129/gox/pkg/timex"
	"github.com/rs/xid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Flow struct {
	BaseUidModel
	Name               string
	Description        string
	PublishedVersionId string
	PublishedVersion   string
}

type FlowVersion struct {
	BaseUidModel
	FlowId        string
	Version       string
	Content       datatypes.JSON
	InputTemplate datatypes.JSON
	Published     bool
}

type FlowRecord struct {
	BaseUidModel
	FlowId        string
	FlowVersionId string
	Version       string         // 版本号
	Status        string         // 执行状态， ready|running|waiting|completed|failed|cancelled
	Input         datatypes.JSON // 输入数据
	Output        datatypes.JSON // 输出数据
	Context       datatypes.JSON // 上下文
	StartTime     int64          // 开始时间
	EndTime       int64          // 结束时间
	RootId        string         // 根执行记录id
	ParentId      string         // 父执行记录id
	ParentStepId  string         // 父执行步骤id
	ParentNodeId  string         // 父节点id
	StartNodeId   string         // 起始节点id
	InputHash     string         // 输入内容hash
}

type FlowStep struct {
	BaseUidModel
	FlowId       string
	RootRecordId string
	RecordId     string
	NodeType     string
	NodeId       string
	NextNodeId   string
	Status       string
	Input        datatypes.JSON
	Output       datatypes.JSON
	StartTime    int64
	EndTime      int64
}

type BaseUidModel struct {
	Id    string         `gorm:"primaryKey;type:varchar(64)"`
	Ctime *timex.Time    `gorm:"autoCreateTime;type:datetime"`
	Mtime *timex.Time    `gorm:"autoUpdateTime;type:datetime"`
	Dtime gorm.DeletedAt `gorm:"index;type:datetime" json:"-"`
}

func (m *BaseUidModel) BeforeCreate(tx *gorm.DB) error {
	if m.Id == "" {
		m.Id = xid.New().String()
	}
	return nil
}
