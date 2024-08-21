package flow

import (
	"time"

	"github.com/qf0129/goflow/model"
	"github.com/qf0129/gox/dbx"
)

func RunWorker() {
	for {
		time.Sleep(time.Second * 3)
		executions := queryReadyFlowExecutions()
		for _, execution := range executions {
			go runExecution(execution)
		}
	}
}

func runExecution(execution *model.FlowExecution) {
	flowVer, err := dbx.QueryOneByPk[model.FlowVersion](execution.FlowVersionId)
	if err != nil {
		setFlowExecutionFailed(execution, err.Error())
		return
	}

	branch, err := NewBranch(flowVer.Content)
	if err != nil {
		setFlowExecutionFailed(execution, err.Error())
		return
	}

	branch.execution = execution
	branch.runNode(branch.StartId, execution.Input)
}
