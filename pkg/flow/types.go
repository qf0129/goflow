package flow

import (
	"sync"

	"github.com/qf0129/goflow/model"
)

type Branch struct {
	StartId string
	Nodes   map[string]*Node

	waitGroup *sync.WaitGroup
	execution *model.FlowExecution
}

type Node struct {
	Id         string
	Type       string
	Name       string
	Config     string
	NextId     string
	InputPath  map[string]string
	OutputPath map[string]string

	JobGroup string
	JobName  string
	// choice
	Choices []*Choice
	// wait
	WaitType    string
	WaitSeconds int64
	// foreach
	ForEachPath string
	// foreach/parallel
	Branchs []*Branch
	// subflow
	SubFlowId        string
	SubFlowVersionId string
}

type Choice struct {
	NextId     string
	Type       string // and, or
	Conditions []*Condition
}

type Condition struct {
	IsNot     bool
	JsonPath  string
	Operator  string // eq,ne,gt,lt,gte,lte,in,nin,ct,nct,regexp
	ValueType string // string, bool, int(int64), float(float64), list([]string)
	Value     string
}
