package flow

import (
	"fmt"
	"time"

	"github.com/qf0129/goflow/model"
	"github.com/qf0129/gox/dbx"
	"github.com/qf0129/gox/logx"
)

func CreateFlowExecution(flowVersionId string, input string) (*model.FlowExecution, error) {
	flowVer, err := dbx.QueryOneByPk[model.FlowVersion](flowVersionId)
	if err != nil {
		return nil, fmt.Errorf("QueryFlowVersionErr: " + err.Error())
	}

	flowExecution := &model.FlowExecution{
		FlowId:        flowVer.FlowId,
		FlowVersionId: flowVer.Id,
		Input:         input,
		Status:        FlowStatusReady,
		StartTime:     time.Now(),
	}
	if err := dbx.Create[model.FlowExecution](flowExecution); err != nil {
		return nil, fmt.Errorf("CreateFlowVersionErr: " + err.Error())
	}
	return flowExecution, nil
}

func queryReadyFlowExecutions() []*model.FlowExecution {
	executions, err := dbx.QueryAll[model.FlowExecution](&dbx.QueryOption{
		Where: map[string]any{"status": FlowStatusReady},
	})
	if err != nil {
		logx.Error(err.Error())
		return []*model.FlowExecution{}
	}
	return executions
}

func queryStepByNodeId(nodeId string) model.FlowStep {
	step, err := dbx.QueryOneByMap[model.FlowStep](map[string]any{"node_id": nodeId})
	if err != nil {
		logx.Error(err.Error())
		return model.FlowStep{}
	}
	return step
}

func setFlowExecutionFailed(execution *model.FlowExecution, msg string) {
	execution.Status = FlowStatusFailed
	execution.Output = msg
	err := dbx.UpdateOneByPk[model.FlowExecution](execution.Id, execution)
	if err != nil {
		logx.Error(err.Error())
	}
}

func NewFlowVersion() string {
	return time.Now().Format("20060102-150405000")
}
