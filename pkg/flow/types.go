package flow

import "goflow/model"

type FlowContent struct {
	StartNodeId string
	NodeMap     map[string]*FlowContentNode

	flowTask *model.FlowTask
}

type FlowContentNode struct {
	Id               string
	Name             string
	Type             string
	NextId           string
	Input            string
	Config           string
	Choices          []*FlowContentNode
	ChoiceConditions []*ChoiceCondition // 作为Choices的子节点时必填
}

type ChoiceCondition struct {
	JsonPath  string
	ValueType string // string, number(int64)
	Operator  string // eq,ne,gt,lt,gte,lte,in,nin,regexp
	Value     string
}

type JobNodeConfig struct {
	// Group string
	Name string
}

type WaitNodeConfig struct {
	JsonPath string
}
