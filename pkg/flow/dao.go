package flow

import (
	"github.com/qf0129/gox/pkg/dbx"
	"github.com/qf0129/gox/pkg/hashx"
)

func createSubFlowExecution(execution *FlowExecution, step *FlowStep, input []byte, startNodeId string) (*FlowExecution, error) {
	rootId := execution.RootId
	if rootId == "" {
		rootId = execution.Id
	}
	subExecution := &FlowExecution{
		FlowId:       execution.FlowId,
		Status:       FlowStatusReady,
		Input:        input,
		Context:      execution.Context,
		RootId:       rootId,
		ParentId:     execution.Id,
		ParentStepId: step.Id,
		ParentNodeId: step.NodeId,
		InputHash:    hashx.GetMD5Hash(input),
		StartNodeId:  startNodeId,
	}
	if err := dbx.Create(subExecution); err != nil {
		return nil, err
	}
	return subExecution, nil
}

func createStep(execution *FlowExecution, node *Node, input []byte) (*FlowStep, error) {
	rootExecutionId := execution.RootId
	if rootExecutionId == "" {
		rootExecutionId = execution.Id
	}
	step := &FlowStep{
		FlowId:          execution.FlowId,
		RootExecutionId: rootExecutionId,
		ExecutionId:     execution.Id,
		NodeType:        node.Type,
		NodeId:          node.Id,
		NextNodeId:      node.NextId,
		Status:          FlowStatusReady,
		Input:           input,
	}
	if err := dbx.Create(&step); err != nil {
		return nil, err
	}
	return step, nil
}
