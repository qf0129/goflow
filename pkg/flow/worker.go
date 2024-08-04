package flow

import (
	"goflow/model"
	"time"

	"github.com/qf0129/gox/dbx"
	"github.com/qf0129/gox/jsonx"
)

func RunWorker() {
	for {
		time.Sleep(time.Second * 3)
		flowTasks := queryReadyFlowTasks()
		for _, flowTask := range flowTasks {
			go runFlowTask(flowTask)
		}
	}
}

func runFlowTask(flowTask *model.FlowTask) {
	flowVer, err := dbx.QueryOneByPk[model.FlowVersion](flowTask.FlowVersionId)
	if err != nil {
		setFlowTaskFailed(flowTask, err.Error())
		return
	}

	flowContent := &FlowContent{}
	if err := jsonx.Unmarshal([]byte(flowVer.Content), flowContent); err != nil {
		setFlowTaskFailed(flowTask, err.Error())
		return
	}

	flowContent.flowTask = flowTask
	flowContent.runContentNode(flowContent.StartNodeId, flowTask.Input)
}
