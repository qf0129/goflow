package flow

import (
	"goflow/model"
	"goflow/pkg/consts"

	"github.com/qf0129/gox/dbx"
	"github.com/qf0129/gox/logx"
)

func queryReadyFlowTasks() []*model.FlowTask {
	flowTasks, err := dbx.QueryAll[model.FlowTask](&dbx.QueryOption{
		Where: map[string]any{"status": consts.FlowStatusReady},
	})
	if err != nil {
		logx.Error(err.Error())
		return []*model.FlowTask{}
	}
	return flowTasks
}

func querySubtaskByNodeId(nodeId string) model.FlowSubtask {
	subtask, err := dbx.QueryOneByMap[model.FlowSubtask](map[string]any{"node_id": nodeId})
	if err != nil {
		logx.Error(err.Error())
		return model.FlowSubtask{}
	}
	return subtask
}

func setFlowTaskFailed(flowTask *model.FlowTask, msg string) {
	flowTask.Status = consts.FlowStatusFailed
	flowTask.Output = msg
	err := dbx.UpdateOneByPk[model.FlowTask](flowTask.Id, flowTask)
	if err != nil {
		logx.Error(err.Error())
	}
}
