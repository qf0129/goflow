package flow

import (
	"time"

	"github.com/oliveagle/jsonpath"
	"github.com/qf0129/goflow/model"
	"github.com/qf0129/gox/dbx"
	"github.com/qf0129/gox/jsonx"
	"github.com/qf0129/gox/logx"
)

func NewBranch(jsonContent string) (*Branch, error) {
	branch := &Branch{}
	if err := jsonx.Unmarshal([]byte(jsonContent), branch); err != nil {
		return nil, err
	}
	return branch, nil
}

func (branch *Branch) runNode(nodeId string, input string) {
	node, ok := branch.Nodes[nodeId]
	if !ok {
		setFlowExecutionFailed(branch.execution, "NotFoundNodeId: "+nodeId)
		return
	}

	step, err := branch.queryOrCreateStep(node, input)
	if err != nil {
		setFlowExecutionFailed(branch.execution, err.Error())
		return
	}

	if step.Status == FlowStatusReady || step.Status == FlowStatusFailed {
		switch node.Type {
		case NodeTypeJob:
			branch.runJobNode(node, step)
		case NodeTypeWait:
			step.Output = step.Input
			branch.runWaitNode(node, step)
		case NodeTypeChoice:
			step.Output = step.Input
			branch.runChoiceNode(node, step)
		case NodeTypeForeach:
			step.Output = step.Input
			branch.runForeachNode(node, step)
		case NodeTypeParallel:
			step.Output = step.Input
			branch.runParallelNode(node, step)
		case NodeTypeSubflow:
			step.Output = step.Input
			branch.runSubflowNode(node, step)
		}
	}

	if step.Status == FlowStatusCompleted {
		if step.NextNodeId != "" {
			branch.runNode(step.NextNodeId, step.Output)
		}
	} else {
		branch.setExecutionFailed(step.Output)
	}
}

func (b *Branch) runJobNode(node *Node, step *model.FlowStep) {
	job, ok := Jobs[node.JobGroup]
	if !ok {
		b.setStepFailed(step, "FlowJobNotFound: "+node.JobName)
		return
	}

	ctx := &JobContext{
		InputJsonData: step.Input,
		InputMap:      make(map[string]any),
	}

	if err := jsonx.Unmarshal([]byte(step.Input), &ctx.InputMap); err != nil {
		b.setStepFailed(step, "FlowJobInputUnmarshalError: "+err.Error())
		return
	}

	job.Handler(ctx)
	if ctx.Successed {
		b.setStepCompleted(step, ctx.OutputJsonData)
	} else {
		b.setStepFailed(step, ctx.OutputJsonData)
	}
}

func (b *Branch) runWaitNode(node *Node, step *model.FlowStep) {
	if node.WaitType == WaitTypeSleep {
		time.Sleep(time.Duration(node.WaitSeconds) * time.Second)
	}
	b.setStepCompleted(step, step.Input)
}

func (b *Branch) runChoiceNode(node *Node, step *model.FlowStep) {
	var inputJson interface{}
	if err := jsonx.Unmarshal([]byte(step.Input), &inputJson); err != nil {
		b.setStepFailed(step, "UnmarshalChoiceInputErr: "+err.Error())
		return
	}
	for _, choice := range node.Choices {
		matched, err := choice.matched(inputJson)
		if err != nil {
			b.setStepFailed(step, "ChoiceMatchErr: "+err.Error())
			return
		}
		if matched {
			step.NextNodeId = choice.NextId
			b.setStepCompleted(step, step.Input)
			return
		}
	}
	step.NextNodeId = node.NextId
	b.setStepCompleted(step, step.Input)
}

func (b *Branch) runForeachNode(node *Node, step *model.FlowStep) {
	data, err := jsonpath.JsonPathLookup(step.Input, node.ForEachPath)
	if err != nil {
		b.setStepFailed(step, "RunForeachNodeErr: "+err.Error())
		return
	}

	if len(node.Branchs) != 1 {
		b.setStepFailed(step, "RunForeachNodeErr: ShouldBeOneBranch")
		return
	}

	subBranch := node.Branchs[0]
	for item := range data.([]any) {
		inputByte, err := jsonx.Marshal(item)
		if err != nil {
			b.setStepFailed(step, "JsonMarshalErr: "+err.Error())
			return
		}
		subBranch.runNode(subBranch.StartId, string(inputByte))
	}
	b.setStepCompleted(step, "")
}

func (b *Branch) runParallelNode(node *Node, step *model.FlowStep) {
	for _, subBranch := range node.Branchs {
		subBranch.runNode(subBranch.StartId, step.Input)
	}
	b.setStepCompleted(step, "")
}

func (b *Branch) runSubflowNode(node *Node, step *model.FlowStep) {
	flowExecution, err := CreateFlowExecution(node.SubFlowVersionId, step.Input)
	if err != nil {
		b.setStepFailed(step, "JsonMarshalErr: "+err.Error())
		return
	}
	exc, _ := jsonx.Marshal(flowExecution)
	b.setStepCompleted(step, string(exc))
}

func (b *Branch) setStepCompleted(step *model.FlowStep, output string) {
	b.updateStep(step, FlowStatusCompleted, output)
}

func (b *Branch) setStepFailed(step *model.FlowStep, msg string) {
	b.updateStep(step, FlowStatusFailed, msg)
}

func (b *Branch) updateStep(step *model.FlowStep, status, output string) {
	step.Status = status
	step.Output = output
	if err := dbx.DB.Save(step).Error; err != nil {
		logx.Error(err.Error())
	}
}

func (b *Branch) setExecutionFailed(msg string) {
	b.execution.Status = FlowStatusFailed
	b.execution.Output = msg
	if err := dbx.DB.Save(b.execution).Error; err != nil {
		logx.Error(err.Error())
	}
}

func (b *Branch) queryOrCreateStep(node *Node, input string) (*model.FlowStep, error) {
	steps, err := dbx.QueryAll[model.FlowStep](&dbx.QueryOption{
		Where: map[string]any{"node_id": node.Id},
	})
	if err != nil {
		return nil, err
	}
	if len(steps) > 0 {
		return steps[0], nil
	}

	step := &model.FlowStep{
		FlowVersionId:   b.execution.FlowVersionId,
		FlowExecutionId: b.execution.Id,
		NodeId:          node.Id,
		NextNodeId:      node.NextId,
		Status:          FlowStatusReady,
		Input:           input,
	}
	if err := dbx.Create[model.FlowStep](&step); err != nil {
		return nil, err
	}
	return step, nil
}
