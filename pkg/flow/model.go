package flow

import (
	"encoding/json"
	"time"

	"github.com/qf0129/gox/pkg/dbx"
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

type FlowExecution struct {
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
	FlowId          string
	RootExecutionId string
	ExecutionId     string
	NodeType        string
	NodeId          string
	NextNodeId      string
	Status          string
	Input           datatypes.JSON
	Output          datatypes.JSON
	StartTime       int64
	EndTime         int64
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

func (step *FlowStep) UpdateNextNodeId(nodeId string) error {
	step.NextNodeId = nodeId
	return dbx.UpdateFileds(step, []string{"NextNodeId"})
}

func (step *FlowStep) SetStart() error {
	step.Status = FlowStatusRunning
	step.StartTime = time.Now().Local().UnixMilli()
	return dbx.UpdateFileds(step, []string{"Status", "StartTime"})
}

func (step *FlowStep) SetWait(msg string) error {
	output, _ := json.Marshal(map[string]string{"msg": msg})
	step.Status = FlowStatusWaiting
	step.Output = output
	return dbx.UpdateFileds(step, []string{"Status", "Output"})
}

func (step *FlowStep) SetFail(msg string) error {
	output, _ := json.Marshal(map[string]string{"msg": msg})
	return step.finish(FlowStatusFailed, output)
}

func (step *FlowStep) SetCancel(msg string) error {
	output, _ := json.Marshal(map[string]string{"msg": msg})
	return step.finish(FlowStatusCancelled, output)
}

func (step *FlowStep) SetComplete(output []byte) error {
	return step.finish(FlowStatusCompleted, output)
}

func (step *FlowStep) finish(status string, output []byte) error {
	step.Status = status
	step.Output = output
	step.EndTime = time.Now().Local().UnixMilli()
	return dbx.UpdateFileds(step, []string{"Status", "Output", "EndTime"})
}

func (step *FlowStep) IsWorking() bool {
	return step.Status == FlowStatusReady ||
		step.Status == FlowStatusRunning ||
		step.Status == FlowStatusWaiting
}

func (e *FlowExecution) SetStart() error {
	e.Status = FlowStatusRunning
	e.Output = nil
	if e.StartTime == 0 {
		e.StartTime = time.Now().Local().UnixMilli()
	}
	return dbx.UpdateFileds(e, []string{"Status", "Output", "StartTime"})
}

func (e *FlowExecution) SetWait(msg string) error {
	output, _ := json.Marshal(map[string]string{"msg": msg})
	e.Status = FlowStatusWaiting
	e.Output = output
	return dbx.UpdateFileds(e, []string{"Status", "Output"})
}

func (e *FlowExecution) SetFail(msg string) error {
	output, _ := json.Marshal(map[string]string{"msg": msg})
	return e.finish(FlowStatusFailed, output)
}

func (e *FlowExecution) SetCancel(msg string) error {
	output, _ := json.Marshal(map[string]string{"msg": msg})
	return e.finish(FlowStatusCancelled, output)
}

func (e *FlowExecution) SetComplete(output []byte) error {
	return e.finish(FlowStatusCompleted, output)
}

func (e *FlowExecution) finish(status string, output []byte) error {
	e.Status = status
	e.Output = output
	e.EndTime = time.Now().Local().UnixMilli()
	return dbx.UpdateFileds(e, []string{"Status", "Output", "EndTime"})
}

func (e *FlowExecution) IsWorking() bool {
	return e.Status == FlowStatusReady || e.Status == FlowStatusRunning
}

func (e *FlowExecution) IsFailed() bool {
	return e.Status == FlowStatusFailed
}

func (e *FlowExecution) CheckCancelled() bool {
	e, _ = dbx.QueryOneByMap[*FlowExecution](map[string]interface{}{"id": e.Id})
	return e.IsCancelled()
}

func (e *FlowExecution) IsCancelled() bool {
	return e.Status == FlowStatusCancelled
}
