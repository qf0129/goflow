package flow

import (
	"context"
	"fmt"
)

type Node struct {
	Id                 string     `json:",omitempty"` // 节点id
	Type               string     `json:",omitempty"` // 节点类型
	Name               string     `json:",omitempty"` // 节点名称
	NextId             string     `json:",omitempty"` // 下一节点id
	InputJsonPath      JsonPath   `json:",omitempty"` // 输入jsonpath
	InputJsonFilter    JsonFilter `json:",omitempty"` // 输入过滤
	OutputJsonPath     JsonPath   `json:",omitempty"` // 输出jsonpath
	OutputJsonFilter   JsonFilter `json:",omitempty"` // 输出过滤
	ContextJsonFilter  JsonFilter `json:",omitempty"` // 上下文过滤
	ResourceIdJsonPath JsonPath   `json:",omitempty"` // 资源ID jsonpath
	// job
	JobGroup           string          `json:",omitempty"` // job组
	JobName            string          `json:",omitempty"` // job名称
	CompletedCondition *ConditionGroup `json:",omitempty"` // 自定义成功条件
	Timeout            int             `json:",omitempty"` // 超时秒数
	PollingInterval    int             `json:",omitempty"` // 轮询间隔秒数
	PollingTimeout     int             `json:",omitempty"` // 轮询总超时秒数
	RetryCount         int             `json:",omitempty"` // 重试次数，默认0次
	RetryInterval      int             `json:",omitempty"` // 重试间隔秒数，默认3秒

	// choice/consumer
	Choices            []*Choice `json:",omitempty"`
	ChoiceDefaultLabel string    `json:",omitempty"`

	// wait
	WaitType    string `json:",omitempty"`
	WaitSeconds int64  `json:",omitempty"`

	// foreach
	ForEachJsonPath       JsonPath `json:",omitempty"`
	ForEachMaxConcurrency int      `json:",omitempty"`

	// foreach/parallel
	Branchs []*Branch `json:",omitempty"`

	// subflow
	SubFlowId string `json:",omitempty"`

	// notify
	NotifyUsers   []string `json:",omitempty"`
	NotifyTitle   string   `json:",omitempty"`
	NotifyContent string   `json:",omitempty"`

	// consumer
	ConsumerName string `json:",omitempty"`
}

func (n *Node) Handle(o *NodeContext) ([]byte, error) {
	return NodeManager.Get(n.Type).Handle(o)
}

func (n *Node) Check() error {
	if n.Id == "" {
		return fmt.Errorf("Id不能为空")
	}
	if n.Type == "" {
		return fmt.Errorf("Type不能为空")
	}
	if n.Id == n.NextId {
		return fmt.Errorf("Id和NextId不能相同")
	}
	nType := NodeManager.Get(n.Type)
	if nType == nil {
		return fmt.Errorf("未知的节点类型%s", n.Type)
	}
	return nType.Check(n)
}

type NodeContext struct {
	C         context.Context
	Execution *FlowExecution
	Step      *FlowStep
	Node      *Node
}

type Choice struct {
	Label          string
	NextId         string
	ConditionGroup *ConditionGroup
}
