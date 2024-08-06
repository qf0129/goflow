package flow

import (
	"sync"
	"time"

	"github.com/qf0129/goflow/model"
)

type FlowContent struct {
	StartNodeId string
	NodeMap     map[string]*FlowContentNode

	waitGroup *sync.WaitGroup
	flowTask  *model.FlowTask
}

type FlowContentNode struct {
	Id   string
	Type string
	Name string
	// Input  string
	Config string
	NextId string
}

// NodeConfig #####################################

type JobNodeConfig struct {
	Group string
	Name  string
}

type WaitNodeConfig struct {
	WaitType     string // sleep, time, tiger
	SleepSeconds int64
	EndTime      time.Time
}

const (
	WaitTypeSleep = "sleep"
	WaitTypeTime  = "time"
	WaitTypeTiger = "tiger"
)

type ChoiceNodeConfig struct {
	ChoiceRules []*ChoiceRule
}

type ChoiceRule struct {
	IsDefault   bool
	JsonPath    string
	ValueType   string // string, bool, number(int64), list([]string)
	Operator    string // eq,ne,gt,lt,gte,lte,in,nin,ct,nct,regexp
	TargetValue string
	NextId      string
}

const (
	ChoiceRuleTypeString = "string"
	ChoiceRuleTypeBool   = "bool"
	ChoiceRuleTypeInt    = "int"
	ChoiceRuleTypeFloat  = "float"
	ChoiceRuleTypeList   = "list"

	ChoiceRuleOperatorEqual       = "eq"
	ChoiceRuleOperatorNotEqual    = "ne"
	ChoiceRuleOperatorGreterThan  = "gt"
	ChoiceRuleOperatorLessThan    = "lt"
	ChoiceRuleOperatorGreterEqual = "ge"
	ChoiceRuleOperatorLessEqual   = "le"
	ChoiceRuleOperatorIn          = "in"
	ChoiceRuleOperatorNotIn       = "nin"
	ChoiceRuleOperatorContain     = "ct"
	ChoiceRuleOperatorNotContain  = "nct"
	ChoiceRuleOperatorRegexp      = "re"
)

type ParallelNodeConfig struct {
	SubFlowContents []*FlowContent
}

type ForeachNodeConfig struct {
	JsonPath       string
	SubFlowContent *FlowContent
}

type NotifyNodeConfig struct {
	Message   string
	JsonPaths []string
}
