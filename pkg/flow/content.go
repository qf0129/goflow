package flow

import (
	"goflow/model"
	"goflow/pkg/consts"
	"time"

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
			subtask.Output = subtask.Input
			content.runWaitNode(node, subtask)
		case consts.NodeTypeForeach:
			subtask.Output = subtask.Input
			content.runForeachNode(node, subtask)
		case consts.NodeTypeChoice:
			subtask.Output = subtask.Input
			content.runChoiceNode(node, subtask)
		case consts.NodeTypeParallel:
			subtask.Output = subtask.Input
			content.runParallelNode(node, subtask)
		case consts.NodeTypeSuccess:
			subtask.Output = subtask.Input
			content.runSuccessNode(node, subtask)
		case consts.NodeTypeFail:
			subtask.Output = subtask.Input
			content.runFailNode(node, subtask)
		case consts.NodeTypeNotify:
			content.runNotifyNode(node, subtask)
		}
	}

	if subtask.Status == consts.FlowStatusCompleted {
		if subtask.NextNodeId != "" {
			content.runContentNode(subtask.NextNodeId, subtask.Output)
		}
	} else {
		content.setTaskFailed(subtask.Output)
	}
}

func (content *FlowContent) runJobNode(node *FlowContentNode, subtask *model.FlowSubtask) {
	conf := &JobNodeConfig{}
	if err := jsonx.Unmarshal([]byte(node.Config), &conf); err != nil {
		content.setSubtaskFailed(subtask, err.Error())
		return
	}

	job, ok := Jobs[conf.Name]
	if !ok {
		content.setSubtaskFailed(subtask, "FlowJobNotFound: "+conf.Name)
		return
	}

	ctx := &JobContext{
		InputJsonData: subtask.Input,
		InputMap:      make(map[string]any),
	}

	if err := jsonx.Unmarshal([]byte(subtask.Input), &ctx.InputMap); err != nil {
		content.setSubtaskFailed(subtask, "FlowJobInputUnmarshalError: "+err.Error())
		return
	}

	job.Handler(ctx)
	if ctx.Successed {
		content.setSubtaskCompleted(subtask, ctx.OutputJsonData)
	} else {
		content.setSubtaskFailed(subtask, ctx.OutputJsonData)
	}
}
func (content *FlowContent) runWaitNode(node *FlowContentNode, subtask *model.FlowSubtask) {
	conf := &WaitNodeConfig{}
	if err := jsonx.Unmarshal([]byte(node.Config), &conf); err != nil {
		content.setSubtaskFailed(subtask, err.Error())
		return
	}

	if conf.WaitType == WaitTypeSleep {
		time.Sleep(time.Duration(conf.SleepSeconds) * time.Second)
	}
	content.setSubtaskCompleted(subtask, "")
}
func (content *FlowContent) runChoiceNode(node *FlowContentNode, subtask *model.FlowSubtask) {
	conf := &ChoiceNodeConfig{}
	if err := jsonx.Unmarshal([]byte(node.Config), &conf); err != nil {
		content.setSubtaskFailed(subtask, "UnmarshalNodeConfigErr: "+err.Error())
		return
	}
	var inputJson interface{}
	if err := jsonx.Unmarshal([]byte(subtask.Input), &inputJson); err != nil {
		content.setSubtaskFailed(subtask, "UnmarshalChoiceInputErr: "+err.Error())
		return
	}
	var matchedRule *ChoiceRule
	for idx, rule := range conf.ChoiceRules {
		if idx > 0 { // 跳过第一个默认规则
			matched, err := rule.matched(inputJson)
			if err != nil {
				content.setSubtaskFailed(subtask, "ChoiceRuleErr: "+err.Error())
				return
			}
			if matched {
				matchedRule = rule
				break
			}
		}
	}
	if matchedRule == nil {
		matchedRule = conf.ChoiceRules[0]
	}
	content.runContentNode(matchedRule.NextId, subtask.Input)
}

func (content *FlowContent) runForeachNode(node *FlowContentNode, subtask *model.FlowSubtask) {
	conf := &ForeachNodeConfig{}
	if err := jsonx.Unmarshal([]byte(node.Config), &conf); err != nil {
		content.setSubtaskFailed(subtask, err.Error())
		return
	}
	// vals := []string{"11", "22", "33"}
	// for _, val := range vals {
	// 	content.waitGroup.Add(1)
	// 	go content.runContentNode()
	// }
}

func (content *FlowContent) runParallelNode(node *FlowContentNode, subtask *model.FlowSubtask) {
}
func (content *FlowContent) runSuccessNode(node *FlowContentNode, subtask *model.FlowSubtask) {
}
func (content *FlowContent) runFailNode(node *FlowContentNode, subtask *model.FlowSubtask) {
}
func (content *FlowContent) runNotifyNode(node *FlowContentNode, subtask *model.FlowSubtask) {
}

func (content *FlowContent) setSubtaskCompleted(subtask *model.FlowSubtask, output string) {
	content.updateSubtask(subtask, consts.FlowStatusCompleted, output)
}

func (content *FlowContent) setSubtaskFailed(subtask *model.FlowSubtask, msg string) {
	content.updateSubtask(subtask, consts.FlowStatusFailed, msg)
}

func (content *FlowContent) updateSubtask(subtask *model.FlowSubtask, status, output string) {
	subtask.Status = status
	subtask.Output = output
	if err := dbx.DB.Save(subtask).Error; err != nil {
		logx.Error(err.Error())
	}
}

func (content *FlowContent) setTaskFailed(msg string) {
	content.flowTask.Status = consts.FlowStatusFailed
	content.flowTask.Output = msg
	if err := dbx.DB.Save(content.flowTask).Error; err != nil {
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
