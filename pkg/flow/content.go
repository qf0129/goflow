package flow

import (
	"goflow/model"
	"goflow/pkg/consts"

	"github.com/qf0129/gox/dbx"
	"github.com/qf0129/gox/jsonx"
	"github.com/qf0129/gox/logx"
)

func (content *FlowContent) runContentNode(nodeId string, input string) {
	node, ok := content.NodeMap[nodeId]
	if !ok {
		setFlowTaskFailed(content.flowTask, "NotFoundNodeId: "+nodeId)
		return
	}

	subtask, err := content.queryOrCreateSubtask(node, input)
	if err != nil {
		setFlowTaskFailed(content.flowTask, err.Error())
		return
	}

	if subtask.Status == consts.FlowStatusReady || subtask.Status == consts.FlowStatusFailed {
		switch node.Type {
		case consts.NodeTypeJob:
			content.runJobNode(node, subtask)
		case consts.NodeTypeWait:
			content.runWaitNode(node, subtask)
		case consts.NodeTypeLoop:
			content.runLoopNode(node, subtask)
		case consts.NodeTypeChoice:
			content.runChoiceNode(node, subtask)
		case consts.NodeTypeParalle:
			content.runParalleNode(node, subtask)
		case consts.NodeTypeSuccess:
			content.runSuccessNode(node, subtask)
		case consts.NodeTypeFailed:
			content.runFailedNode(node, subtask)
		}
	}

	if subtask.Status == consts.FlowStatusCompleted && subtask.NextNodeId != "" {
		content.runContentNode(subtask.NextNodeId, subtask.Output)
		return
	}
}

func (content *FlowContent) runJobNode(node *FlowContentNode, subtask *model.FlowSubtask) {
	conf := &JobNodeConfig{}
	if err := jsonx.Unmarshal([]byte(node.Config), &conf); err != nil {
		content.setSubtaskFailed(subtask, err.Error())
		return
	}

}
func (content *FlowContent) runWaitNode(node *FlowContentNode, subtask *model.FlowSubtask) {
}
func (content *FlowContent) runLoopNode(node *FlowContentNode, subtask *model.FlowSubtask) {
}
func (content *FlowContent) runChoiceNode(node *FlowContentNode, subtask *model.FlowSubtask) {
}
func (content *FlowContent) runParalleNode(node *FlowContentNode, subtask *model.FlowSubtask) {
}
func (content *FlowContent) runSuccessNode(node *FlowContentNode, subtask *model.FlowSubtask) {
}
func (content *FlowContent) runFailedNode(node *FlowContentNode, subtask *model.FlowSubtask) {
}

func (content *FlowContent) setSubtaskFailed(subtask *model.FlowSubtask, msg string) {
	subtask.Status = consts.FlowStatusFailed
	subtask.Output = msg
	err := dbx.UpdateOneByPk[model.FlowSubtask](subtask.Id, subtask)
	if err != nil {
		logx.Error(err.Error())
	}
	content.flowTask.Status = consts.FlowStatusFailed
	content.flowTask.Output = msg
	err = dbx.UpdateOneByPk[model.FlowTask](content.flowTask.Id, content.flowTask)
	if err != nil {
		logx.Error(err.Error())
	}
}

func (content *FlowContent) queryOrCreateSubtask(node *FlowContentNode, input string) (*model.FlowSubtask, error) {
	subtasks, err := dbx.QueryAll[model.FlowSubtask](&dbx.QueryOption{
		Where: map[string]any{"node_id": node.Id},
	})
	if err != nil {
		return nil, err
	}
	if len(subtasks) > 0 {
		return subtasks[0], nil
	}

	subtask := &model.FlowSubtask{
		FlowVersionId: content.flowTask.FlowVersionId,
		FlowTaskId:    content.flowTask.Id,
		NodeId:        node.Id,
		NextNodeId:    node.NextId,
		Status:        consts.FlowStatusReady,
		Input:         input,
	}
	if err := dbx.Create[model.FlowSubtask](&subtask); err != nil {
		return nil, err
	}
	return subtask, nil
}
